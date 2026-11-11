// Check the actual mobile Command Center layout with headless Chrome (Node 22, no dependencies).
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, extname, resolve, sep } from 'node:path';

const root = resolve(new URL('../', import.meta.url).pathname);
const mime = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css',
  '.png':'image/png','.jpg':'image/jpeg','.webmanifest':'application/manifest+json' };
const server=createServer(async (req,res)=>{
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file=pathname==='/'?join(root,'index.html'):resolve(root,'.'+pathname);
    if(!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}
    const data=await readFile(file);
    res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream'});
    res.end(data);
  }catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const sitePort=server.address().port;
const profile=await mkdtemp(join(tmpdir(),'tmg-chrome-'));
const chrome=spawn(process.env.CHROME_BIN||'google-chrome',[
  '--headless=new','--no-sandbox','--disable-dev-shm-usage','--no-first-run',
  '--disable-gpu','--remote-allow-origins=*','--remote-debugging-port=0',
  '--window-size=500,960','--user-data-dir='+profile,'about:blank'
],{stdio:'ignore'});
const delay=ms=>new Promise(r=>setTimeout(r,ms));
let socket;
try {
  let debuggerPort=null;
  // Cold CI runners can take well over 12s to start Chrome; wait up to 60s.
  for(let i=0;i<600;i++){
    if(chrome.exitCode!==null)throw Error('Chrome exited early: '+chrome.exitCode);
    try{
      debuggerPort=Number((await readFile(join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0]);
      if(debuggerPort)break;
    }catch{}
    await delay(100);
  }
  assert.ok(debuggerPort,'Headless Chrome did not start');
  const targets=await (await fetch('http://127.0.0.1:'+debuggerPort+'/json/list')).json();
  const target=targets.find(x=>x.type==='page');
  assert.ok(target,'Missing Chrome page target');
  socket=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((ok,fail)=>{
    socket.addEventListener('open',ok,{once:true});
    socket.addEventListener('error',fail,{once:true});
  });
  let nextId=1;
  const pending=new Map();
  socket.addEventListener('message',ev=>{
    const data=JSON.parse(ev.data);
    if(!data.id||!pending.has(data.id))return;
    const {resolve,reject}=pending.get(data.id);
    pending.delete(data.id);
    data.error?reject(Error(data.error.message)):resolve(data.result);
  });
  const cmd=(method,params={})=>new Promise((resolve,reject)=>{
    const id=nextId++;pending.set(id,{resolve,reject});
    socket.send(JSON.stringify({id,method,params}));
  });
  await cmd('Page.enable');
  await cmd('Runtime.enable');
  await cmd('Page.addScriptToEvaluateOnNewDocument',{
    source:"try{localStorage.setItem('sctmg_intro_seen','1')}catch(e){}"
  });
  await cmd('Page.navigate',{url:'http://127.0.0.1:'+sitePort+'/index.html'});
  let loaded=false;
  // Cold CI runners can take well over 12s to start Chrome; wait up to 60s.
  for(let i=0;i<600;i++){
    try{
      const e=await cmd('Runtime.evaluate',{
        expression:"document.readyState === 'complete' && !!document.querySelector('.sc-home-main')",
        returnByValue:true
      });
      if(e.result?.value){loaded=true;break;}
    }catch{}
    await delay(100);
  }
  assert.ok(loaded,'Command Center did not load in Chrome');
  const viewports=[[390,844],[375,667],[360,640],[320,568],[412,915]];
  await mkdir(join(root,'artifacts'),{recursive:true});
  for(const [width,height] of viewports){
    await cmd('Emulation.setDeviceMetricsOverride',{
      width,height,deviceScaleFactor:1,mobile:true,
      screenWidth:width,screenHeight:height
    });
    await delay(700);
    const output=await cmd('Runtime.evaluate',{
      expression:String.raw`(() => {
        const rect=x=>{
          const r=x.getBoundingClientRect();
          return {top:r.top,bottom:r.bottom,height:r.height,left:r.left,right:r.right};
        };
        const $=selector=>document.querySelector(selector);
        const links=[...document.querySelectorAll('.sc-home-faction-link,.sc-home-manual-link')];
        return {
          width:innerWidth,height:innerHeight,
          scrollHeight:document.scrollingElement.scrollHeight,
          main:{clientHeight:$('.sc-home-main').clientHeight,
            scrollHeight:$('.sc-home-main').scrollHeight},
          links:links.map(link=>({name:link.getAttribute('href'),...rect(link)})),
          content:[...document.querySelectorAll('.sc-home-faction-content')].map(el=>{
            const card=el.closest('.sc-home-faction-card');
            return {content:rect(el),card:rect(card)};
          }),
          manual:rect($('.sc-home-manual')),
          cardLayout:getComputedStyle($('.sc-home-factions')).gridTemplateRows
        };
      })()`,
      returnByValue:true
    });
    const data=output.result?.value;
    assert.ok(data,'Missing viewport diagnostics');
    const picture=await cmd('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
    await writeFile(join(root,'artifacts','home-'+width+'x'+height+'.png'),Buffer.from(picture.data,'base64'));
    const details=JSON.stringify(data);
    assert.equal(data.links.length,5,'All five home destinations required: '+details);
    assert.ok(data.scrollHeight<=height+2,'Home requires scrolling: '+details);
    assert.ok(data.main.scrollHeight<=data.main.clientHeight+2,'Home content clipped: '+details);
    for(const link of data.links){
      assert.ok(link.height>=40,'Link touch target too short: '+details);
      assert.ok(link.top>=-2&&link.bottom<=height+2,'Link outside viewport: '+details);
    }
    for(const item of data.content){
      assert.ok(item.content.top>=item.card.top-2&&item.content.bottom<=item.card.bottom+2,
        'Faction text clipped: '+details);
    }
    console.log(width+'x'+height+': all five links visible; page='+data.scrollHeight+
      '; main='+data.main.scrollHeight+'/'+data.main.clientHeight+'; rows='+data.cardLayout);
  }
}finally{
  socket?.close();
  chrome.kill('SIGTERM');
  server.close();
  await rm(profile,{recursive:true,force:true}).catch(()=>{});
}

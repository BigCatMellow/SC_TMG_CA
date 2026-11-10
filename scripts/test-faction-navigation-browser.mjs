// Browser smoke check for the unified five-tab faction setup on Android-sized screens.
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
  for(let i=0;i<120;i++){
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
  await mkdir(join(root,'artifacts'),{recursive:true});
  await cmd('Emulation.setDeviceMetricsOverride',{
    width:390,height:844,deviceScaleFactor:1,mobile:true,
    screenWidth:390,screenHeight:844
  });
  for(const faction of ['Zerg','Terran','Protoss']){
    const page=faction+' Army.dc.html';
    await cmd('Page.navigate',{
      url:'http://127.0.0.1:'+sitePort+'/'+encodeURIComponent(page)
    });
    let loaded=false;
    for(let i=0;i<100;i++){
      try{
        const e=await cmd('Runtime.evaluate',{
          expression:"document.readyState==='complete' && document.body && document.body.textContent.includes('Engagement Size')",
          returnByValue:true
        });
        if(e.result?.value){loaded=true;break;}
      }catch{}
      await delay(100);
    }
    assert.ok(loaded,faction+' did not load faction setup');
    await delay(650);
    const expr = "(() => {"+
      "const buttons=[...document.querySelectorAll('button')].filter(b=>{const r=b.getBoundingClientRect();return r.width>0&&r.height>0;});"+
      "const labels=buttons.map(b=>b.textContent.trim()).filter(Boolean);"+
      "const txt=document.body.innerText;"+
      "return {labels,hasScale:txt.includes('Engagement Size'),"+
      "hasRosterTab:labels.some(x=>x==='Roster'),"+
      "containsSizes:['Skirmish','Standard','Grand'].every(x=>labels.includes(x)),"+
      "pageHeight:document.documentElement.scrollHeight,viewportHeight:innerHeight};"+
      "})()";
    const response=await cmd('Runtime.evaluate',{expression:expr,returnByValue:true});
    const data=response.result?.value;
    assert.ok(data,faction+' missing browser report');
    assert.ok(data.hasScale,faction+' engagement size missing from visible page');
    assert.ok(data.containsSizes,faction+' all three sizes not visible: '+JSON.stringify(data));
    assert.ok(!data.hasRosterTab,faction+' retired Roster label still visible');
    const image=await cmd('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
    await writeFile(join(root,'artifacts','faction-'+faction.toLowerCase()+'-390x844.png'),
      Buffer.from(image.data,'base64'));
    console.log(faction+' live mobile setup: '+JSON.stringify(data));
  }
}finally{
  socket?.close();
  chrome.kill('SIGTERM');
  server.close();
  await rm(profile,{recursive:true,force:true}).catch(()=>{});
}

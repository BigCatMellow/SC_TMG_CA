// Rebuild NotebookLM TXT sources from companion data; --check verifies Git files.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const sandbox={window:{}};
for(const p of ['battle-rules-data.js','terran-data.js','zerg-data.js','protoss-data.js'])vm.runInNewContext(read(p),sandbox,{filename:p});
const appendix=JSON.parse(read('agent-rules/appendix-2026.json'));
function buildStudy(rules,units,appendix){
 const out={};
 const bar="=".repeat(65);
 const sources={
  rules:"https://starcraft-tmg.com/files/downloads/StarCraft-TMG_EN.pdf",
  faq:"https://starcraft-tmg.com/files/downloads/StarCraft-TMG-FAQ_EN.pdf",
  costs:"https://starcraft-tmg.com/files/downloads/StarCraft-TMG-Cost-Table-10.2026_EN.pdf",
  changelog:"https://starcraft-tmg.com/files/downloads/StarCraft-TMG-Changelog-10.2026_EN.pdf",
  official:"https://starcraft-tmg.com/downloads"
 };
 const str=(lines)=>lines.join("\n")+"\n";
 const fmtSec=(sec)=>{
   const L=[bar,sec.name,`Citation: ${sec.sourceLabel}`,sec.meta||""];
   for(const group of sec.groups){
      L.push("",group.name.toUpperCase());
      for(const item of group.items)L.push("- "+item.t);
   }
   return L.join("\n");
 };
 const all=rules.sections,shared=all.filter(s=>s.scope==="core");
 out["00_START_HERE.txt"]=str([
 "STARCRAFT TMG — NOTEBOOKLM STUDY PACK",
 "Generated from the companion repo, not a replacement for publisher rules/cards.",
 "Authority: 2026 Core Rules for mechanics; FAQ v1.1 for clarified exceptions;",
 "October 2026 official table for point costs; published card sheets for exact abilities.",
 "Note: the rulebook's original price appendix contains superseded point values.",
 "Missing Wave 2/3 units are NOT covered by this companion until implemented.",
 `Rules: ${sources.rules}`,`FAQ: ${sources.faq}`,`Current costs: ${sources.costs}`
 ]);
 out["01_CORE_RULES.txt"]=str([
 "CORE RULES — CONCISE, CITED COMPANION SUMMARY",
 `Publisher Core Rules: ${sources.rules}`,
 ...shared.filter(s=>!s.id.startsWith("faq-")).map(fmtSec)
 ]);
 out["02_OFFICIAL_FAQ_STUDY.txt"]=str([
 "PUBLISHER FAQ v1.1 — PARAPHRASED CLARIFICATIONS",
 `Official FAQ: ${sources.faq}`,
 ...shared.filter(s=>s.id.startsWith("faq-")).map(fmtSec)
 ]);
 const costs=["CURRENT OCTOBER 2026 POINTS & SUPPLY",`Official Cost Table: ${sources.costs}`,"The old rulebook appendix is NOT authoritative for current prices.",""];
 const labels={terran:"TERRAN",zerg:"ZERG",protoss:"PROTOSS"};
 for(const f of ["terran","zerg","protoss"]){
   const d=units[f],mapped=appendix.factions[f];const names=new Map(d.UNITS.map(u=>[u.id,u.name]));
   costs.push(bar,labels[f]+" — UNITS");
   for(const [id,v]of Object.entries(mapped.units)){
      costs.push(`${names.get(id)||id}${v.wave?" [Wave "+v.wave+"]":""}`);
      for(const c of v.compositions)costs.push(`  ${c[0]} models: ${c[1]} Minerals, Supply ${c[2]}`);
      for(const [name,amount]of Object.entries(v.upgrades||{}))costs.push(`  Upgrade ${name}: ${amount.join("/")} Minerals`);
   }
   costs.push("TACTICAL CARDS (VESPENE)");
   const tactics=new Map(d.TACTICAL_CARDS.map(x=>[x.id,x.name]));
   for(const [id,v]of Object.entries(mapped.tactical))costs.push(`  ${tactics.get(id)||id}: ${v} Gas`);
 }
 out["03_CURRENT_POINTS.txt"]=str(costs);
 for(const f of ["terran","zerg","protoss"]){
   const d=units[f],lines=[labels[f]+" UNIT AND CARD REFERENCE",
   "Companion implementation only; verify exact rulings against publisher cards.",
   `Rules: ${sources.rules}`,`Current points: ${sources.costs}`];
   for(const c of d.FACTION_CARDS||[])lines.push("",bar,`FACTION CARD: ${c.name}`,`Slots: ${JSON.stringify(c.slots||{})}`);
   for(const u of d.UNITS){
     lines.push("",bar,`${u.name} | ${u.role} | ${u.tags.join(", ")}`,
       `Stats: SPD ${u.stats.speed}; EVADE ${u.stats.evade}; ARMOUR ${u.stats.armour}; HP ${u.stats.hp}; SIZE ${u.stats.size}; SHIELD ${u.stats.shield??"—"}`);
     const p=appendix.factions[f].units[u.id];
     if(p){for(const c of p.compositions)lines.push(`Buy ${c[0]} models: ${c[1]} Minerals / Supply ${c[2]}`);if(p.cardSource)lines.push(`Wave card: ${p.cardSource}`);}
     else lines.push("Summoned/reference-only or otherwise not directly purchasable.");
     for(const w of u.weapons||[])lines.push(`Weapon ${w.name} (${w.phase}): Range ${w.range}, RoA ${w.roa}, Hit ${w.hit}, Target ${w.target}, Surge ${w.surge}, SDie ${w.sDie}, DMG ${w.damage}; ${(w.keywords||[]).join(", ")}`);
     for(const a of [...(u.abilities||[]),...Object.values(u.phaseAbilities||{}).flat()])lines.push(`Ability ${a.name} (${a.type}, ${a.phase||"See card"}): ${a.description}`);
     for(const a of Object.values(u.upgrades||{}).flat())lines.push(`Upgrade ${a.name} (${a.cost} Minerals): ${a.description||""}${a.specialist?" [SPECIALIST: single model]":""}`);
   }
   lines.push("",bar,"TACTICAL CARDS");
   for(const t of d.TACTICAL_CARDS){
     lines.push(`${t.name}: ${t.cost} Gas; ${t.unique?"Unique":"Repeatable purchase"}; resource ${t.resource||"—"}; slots ${JSON.stringify(t.slots||{})}`);
     for(const a of t.abilities||[])lines.push(`  ${a.name} (${a.type}, ${a.phase}): ${a.description}`);
   }
   out[`1${["terran","zerg","protoss"].indexOf(f)}_${labels[f]}_FACTION.txt`]=str(lines);
 }
 out["20_NOTEBOOKLM_QUIZ_PROMPTS.txt"]=str([
 "NOTEBOOKLM QUIZ PROMPTS — ONE QUESTION AT A TIME",
 "",
 "1. Use ONLY these uploaded source files and official PDFs.",
 "2. Quiz me on legal round sequence, Reactions, activation passing, scoring and combat.",
 "3. Give one concrete situation; wait for my answer before grading it.",
 "4. Grade with a section/page citation. If a source is silent, say so.",
 "5. Alternate shared rules with my chosen faction's weapons and abilities.",
 "6. Include current 2026-10-09 prices and legal exact model counts.",
 "7. Ask harder scenarios about Surge, Evade, mission exceptions, cover, PLACE.",
 "8. Challenge me to spot false assumptions in a roster or battle sequence.",
 "9. Track misses and build an end-of-session review focused on weak areas.",
 "10. Do not invent Wave 2/3 units or cards missing from the uploaded sources."
 ]);
 out["99_PUBLISHER_LINKS.txt"]=str([
 "OFFICIAL SOURCE FILES — DOWNLOAD DIRECTLY FROM PUBLISHER",
 ...Object.entries(sources).map(([k,v])=>`${k}: ${v}`),
 ...Object.entries(appendix.card_sources||{}).map(([k,v])=>`Wave 1 ${k}: ${v}`),
 ...Object.values(appendix.factions).flatMap(f=>Object.values(f.units).filter(v=>v.cardSource).map(v=>`Wave 2: ${v.cardSource}`)),
 "The full original book, diagrams, and verbatim chapter extraction are not mirrored in this public repo."
 ]);
 return out;
}
const results=buildStudy(sandbox.window.SCTMG_BATTLE_RULES,{terran:sandbox.window.SCTMG_TERRAN,zerg:sandbox.window.SCTMG_ZERG,protoss:sandbox.window.SCTMG_PROTOSS},appendix);
const dir=path.join(root,'notebooklm','sources');
let stale=false;
for(const [name,content] of Object.entries(results)){
 const target=path.join(dir,name);
 if(process.argv.includes('--check')){
  if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==content){console.error('Stale study source:',name);stale=true;}
 }else{fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(target,content);}
}
if(stale)process.exitCode=1;else console.log(Object.keys(results).length+' NotebookLM study files '+(process.argv.includes('--check')?'verified':'generated'));

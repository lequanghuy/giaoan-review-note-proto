// Screenshots: NODE_PATH=/usr/local/lib/node_modules node shots.js
const { chromium } = require('playwright-core');
const URL='file:///workspace/ga-retry-save/new02-qa-fixes/index.html', OUT='/workspace/ga-retry-save/new02-qa-fixes/shots/';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--headless=new']});
for(const [w,dpr,name] of [[1280,1,'desktop-1280'],[720,1,'tablet-720'],[390,2,'mobile-390']]){
 const c=await b.newContext({viewport:{width:w,height:900},deviceScaleFactor:dpr}); const p=await c.newPage();
 await p.goto(URL); await p.waitForTimeout(200);
 await p.screenshot({path:OUT+name+'-all-states.png',fullPage:true});
 await c.close();
}
// 2x close-ups
for(const w of [1280,390]){
 const c=await b.newContext({viewport:{width:w,height:900},deviceScaleFactor:2}); const p=await c.newPage(); await p.goto(URL);
 for(const [id,n] of [['h1-before','heading-before'],['h1-after','heading-after'],['h1-forming','heading-forming-sub-editable'],['r-kn-empty','error-line-kien-thuc'],['r-content-long','error-line-4000'],['r-minutes','error-line-minutes'],['multi','multi-field'],['net-pair','network-vs-data'],['net-c','data-error-field-unknown'],['icon-1','icon-on-data-error'],['hint-net','hint-network'],['hint-data','hint-data-error']]){
   const el=await p.$('#'+id); await el.scrollIntoViewIfNeeded(); await el.screenshot({path:`${OUT}closeup-${w}-${n}.png`}); }
 await c.close();
}
// real keyboard focus + live click-through shots
for(const w of [1280,390]){
 const c=await b.newContext({viewport:{width:w,height:900},deviceScaleFactor:2}); const p=await c.newPage(); await p.goto(URL+'?live=1');
 await p.evaluate(()=>document.getElementById('livebox').scrollIntoView());
 await p.click('#live .fld[data-key=knowledge] .inp'); await p.keyboard.press('Control+A'); await p.keyboard.press('Delete'); await p.waitForTimeout(1200);
 await (await p.$('#live')).screenshot({path:`${OUT}live-${w}-typing-in-invalid-field.png`});
 await p.click('#h-long'); await p.click('#h-min'); await p.waitForTimeout(1100);
 await (await p.$('#live')).screenshot({path:`${OUT}live-${w}-three-invalid.png`});
 await c.close();
}
await b.close();})();

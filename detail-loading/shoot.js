const PW='/home/box/.npm/_npx/705bc6b22212b352/node_modules/playwright-core';
const {webkit}=require(PW);
const path=require('path');
const OUT=path.join(__dirname,'shots');
const file='file://'+path.join(__dirname,'index.html');
const VPs=[
  ['375',375,812],['768',768,1024],['1024',1024,768],['1440',1440,900],
  ['820',820,1180],['1180',1180,820],
];
(async()=>{
 const b=await webkit.launch();
 for(const [name,w,h] of VPs){
  const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:2});
  const p=await ctx.newPage();
  // shell proposal
  await p.goto(file+'?state=shell',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(500);
  await p.screenshot({path:`${OUT}/shell-${name}.png`,fullPage:false});
  await p.goto(file+'?state=pressed',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(400);
  await p.screenshot({path:`${OUT}/pressed-${name}.png`,fullPage:false});
  await p.goto(file+'?state=slow',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(400);
  await p.screenshot({path:`${OUT}/slow-${name}.png`,fullPage:false});
  await p.goto(file+'?state=error',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(400);
  await p.screenshot({path:`${OUT}/error-${name}.png`,fullPage:false});
  await p.goto(file+'?state=shell&motion=reduce',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(400);
  await p.screenshot({path:`${OUT}/shell-reduced-${name}.png`,fullPage:false});
  await p.goto(file+'?state=ready',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(400);
  await p.screenshot({path:`${OUT}/ready-${name}.png`,fullPage:false});
  await ctx.close();
 }
 // before/after strip from page itself at 820
 const ctx=await b.newContext({viewport:{width:820,height:1180},deviceScaleFactor:2});
 const p=await ctx.newPage();
 await p.goto(file+'?state=shell',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(500);
 await p.evaluate(()=>scrollTo(0,0));
 await p.locator('#ba').screenshot({path:`${OUT}/before-after-strip-820.png`});
 await ctx.close();
 await b.close();
 console.log('shots ok');
})().catch(e=>{console.error(e);process.exit(1)})

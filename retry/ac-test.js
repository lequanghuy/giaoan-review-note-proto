// AC1-AC6 + icon-version checks (a)-(g). Run: NODE_PATH=/usr/local/lib/node_modules node ac-test.js
const { chromium } = require('playwright-core');
const URL = process.env.URL || 'file:///workspace/ga-retry-save/mockup.html';
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--headless=new']});
const res=[];const ok=(n,c,d)=>res.push((c?'PASS ':'FAIL ')+n+(d?' · '+d:''));
for (const w of [390,720,1280]){
 const T=`[${w}] `;
 // ---- static board: (a) no icon in Saved/Saving/Retrying/Success, (e) identical title row across states
 const sp=await (await b.newContext({viewport:{width:w,height:900}})).newPage();
 await sp.goto(URL);
 const rows=await sp.evaluate(()=>[...document.querySelectorAll('[data-state]:not(#st-blocked):not(#st-now)')].map(x=>{const c=x.querySelector('.card').getBoundingClientRect(),t=x.querySelector('.card-title').getBoundingClientRect(),h=x.querySelector('.hd').getBoundingClientRect(),l=x.querySelector('.save-label').getBoundingClientRect();return {s:x.dataset.state,icon:!!x.querySelector('.save-retry'),cardH:+c.height.toFixed(2),hdH:+h.height.toFixed(2),titleX:+(t.x-c.x).toFixed(2),titleY:+(t.y-c.y).toFixed(2),labelRight:+(c.right-l.right).toFixed(2),labelX:+(l.x-c.x).toFixed(2)}}));
 const noIcon=['saved','saving','retrying','success'];
 ok(T+'(a) no icon in Saved/Saving/Retrying/Success', rows.filter(r=>noIcon.includes(r.s)).every(r=>!r.icon));
 ok(T+'icon present in Error/Hover/Focus/Again', rows.filter(r=>['error','hover','focus','again'].includes(r.s)).every(r=>r.icon));
 const uniq=k=>new Set(rows.map(r=>r[k])).size===1;
 ok(T+'(e) row height, card height, title position identical across all states', uniq('cardH')&&uniq('hdH')&&uniq('titleX')&&uniq('titleY'), JSON.stringify({cardH:rows[0].cardH,hdH:rows[0].hdH,titleX:rows[0].titleX,titleY:rows[0].titleY}));
 ok(T+'(e) label does not jump (right edge and left edge identical across states)', uniq('labelRight')&&uniq('labelX'), JSON.stringify({labelRight:rows[0].labelRight,labelX:rows[0].labelX}));
 ok(T+'AC6 title row does not wrap (row height = title height)', rows.every(r=>r.hdH<=24.2));
 await sp.close();

 // ---- live
 const ctx=await b.newContext({viewport:{width:w,height:800},hasTouch:w<720});
 const pg=await ctx.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
 await pg.goto(URL+'?live=1');
 const L=s=>`#live ${s}`, label=()=>pg.evaluate(()=>document.querySelector('#live .save-label').innerText.trim());
 const puts=()=>pg.evaluate(()=>+document.getElementById('cnt').textContent.replace(/\D/g,''));
 const iconExists=()=>pg.evaluate(()=>!!document.querySelector('#live .save-retry'));
 const focusInfo=()=>pg.evaluate(()=>{const a=document.activeElement;return a===document.body?'BODY':(a.className||a.tagName)});
 // initial Saved
 ok(T+'AC1/(a) Saved: label "Đã lưu", no icon', (await label())==='Đã lưu' && !(await iconExists()));
 const ta=L('textarea');
 await pg.click(ta); await pg.keyboard.press('End'); await pg.keyboard.type(' ABC'); const typed=await pg.inputValue(ta);
 await pg.waitForTimeout(450);
 ok(T+'AC1 error: label exactly "Chưa lưu được", no Lỗi/lỗi/sai/máy chủ', (await label())==='Chưa lưu được' && !/[Ll]ỗi|sai|máy chủ/.test(await label()));
 ok(T+'AC1 no toast element in the DOM', await pg.evaluate(()=>!document.querySelector('[role=alert],[class*=toast]')));
 // (b) accessible name
 const nm=await pg.evaluate(()=>{const b=document.querySelector('#live .save-retry');return {aria:b.getAttribute('aria-label'),tag:b.tagName,type:b.type,svgHidden:b.querySelector('svg').getAttribute('aria-hidden'),tipHidden:document.querySelector('#live .save-tip').getAttribute('aria-hidden')}});
 ok(T+'(b) icon is a <button> named "Thử lại" via aria-label (tooltip is aria-hidden, not the only name)', nm.tag==='BUTTON'&&nm.aria==='Thử lại'&&nm.svgHidden==='true'&&nm.tipHidden==='true', JSON.stringify(nm));
 ok(T+'aria-live polite on label', await pg.evaluate(()=>document.querySelector('#live .save-label').getAttribute('aria-live')==='polite'));
 // (c) tooltip: hover, focus, Esc, no layout shift, no clip
 const geo=()=>pg.evaluate(()=>{const c=document.querySelector('#live .card').getBoundingClientRect(),h=document.querySelector('#live .hd').getBoundingClientRect(),t=document.querySelector('#live .card-title').getBoundingClientRect(),l=document.querySelector('#live .save-label').getBoundingClientRect();return [c.height,h.height,t.x,t.y,l.x,l.right].map(v=>+v.toFixed(2)).join(',')});
 const tipState=()=>pg.evaluate(()=>{const t=document.querySelector('#live .save-tip');const cs=getComputedStyle(t);const r=t.getBoundingClientRect(),c=document.querySelector('#live .card').getBoundingClientRect();return {vis:cs.visibility==='visible',inCard:r.left>=c.left&&r.right<=c.right,inViewport:r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight,w:Math.round(r.width)}});
 await pg.evaluate(()=>document.activeElement.blur()); await pg.mouse.move(0,0);
 const g0=await geo(); const t0=await tipState();
 ok(T+'(c) tooltip hidden at rest', !t0.vis);
 const bb=await (await pg.$(L('.save-retry'))).boundingBox();
 if(w>=720){ await pg.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2); await pg.waitForTimeout(80);
   const th=await tipState(); ok(T+'(c) tooltip shows on hover, inside card and viewport', th.vis&&th.inCard&&th.inViewport, JSON.stringify(th));
   ok(T+'(c) hover causes no layout shift', (await geo())===g0);
   await pg.keyboard.press('Escape'); await pg.waitForTimeout(50); ok(T+'(c) Esc dismisses hover tooltip', !(await tipState()).vis);
   await pg.mouse.move(0,0); }
 else ok(T+'(c) hover n/a on touch (tooltip is a nicety)', true);
 await pg.focus(L('.save-retry')); await pg.keyboard.press('Tab'); await pg.keyboard.press('Shift+Tab'); await pg.waitForTimeout(80);
 const tf=await tipState(); ok(T+'(c) tooltip shows on keyboard focus-visible, inside card and viewport', tf.vis&&tf.inCard&&tf.inViewport, JSON.stringify(tf));
 ok(T+'(c) focus causes no layout shift', (await geo())===g0);
 const ring=await pg.evaluate(()=>{const cs=getComputedStyle(document.querySelector('#live .save-retry'));return cs.outlineStyle+' '+cs.outlineWidth+' '+cs.outlineColor});
 ok(T+'focus ring = 2px solid #2563eb (like .rv-done:focus-visible)', /solid 2px rgb\(37, 99, 235\)/.test(ring), ring);
 await pg.keyboard.press('Escape'); await pg.waitForTimeout(50); ok(T+'(c) Esc dismisses focus tooltip', !(await tipState()).vis);
 ok(T+'(c) Esc leaves focus on the icon', (await focusInfo()).includes('save-retry'));
 // contrast / size
 const sz=await pg.evaluate(()=>{const r=document.querySelector('#live .save-retry').getBoundingClientRect(),s=document.querySelector('#live .save-retry svg').getBoundingClientRect();return {btn:[r.width,r.height],glyph:[s.width,s.height],color:getComputedStyle(document.querySelector('#live .save-retry')).color}});
 ok(T+'visual 24px, glyph 14px, colour #92400E (7.09:1 on white; glyph needs 3:1)', sz.btn[0]===24&&sz.btn[1]===24&&sz.glyph[0]===14&&sz.color==='rgb(146, 64, 14)', JSON.stringify(sz));
 // (d) tap target 44px
 const hit=await pg.evaluate(()=>{const r=document.querySelector('#live .save-retry').getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;const hit=(dx,dy)=>{const e=document.elementFromPoint(cx+dx,cy+dy);return !!(e&&e.closest('.save-retry'))};return {in:[hit(-21,0),hit(21,0),hit(0,-21),hit(0,21),hit(-21,-21),hit(21,21)],out:[hit(-24,0),hit(24,0),hit(0,-24),hit(0,24)]}});
 ok(T+'(d) tap target >=44x44 (hit-test ±21 in, ±24 out)', hit.in.every(Boolean)&&hit.out.every(x=>!x), JSON.stringify(hit));
 // AC2/(f)/(g): retry, keyboard
 const p0=await puts(); await pg.focus(L('.save-retry')); await pg.keyboard.press('Enter'); const tPress=Date.now(); await pg.waitForTimeout(60);
 ok(T+'AC2 click → label "Đang lưu"', (await label())==='Đang lưu');
 ok(T+'(a) Retrying: no icon element', !(await iconExists()));
 const f1=await focusInfo(); ok(T+'(f) focus not lost to <body> at press (on stable label target)', f1!=='BODY', f1);
 // hammer: repeated clicks/keys while saving
 await pg.evaluate(()=>{const lt=document.querySelector('#live .save-label .lt');lt.click();lt.click()});
 await pg.keyboard.press('Enter'); await pg.keyboard.press('Space'); await pg.waitForTimeout(100);
 ok(T+'(f) focus still not <body> while retrying after more keys', (await focusInfo())!=='BODY', await focusInfo());
 await pg.waitForFunction(()=>document.querySelector('#live .save-label').innerText.trim()!=='Đang lưu',null,{timeout:3000});
 const dur=Date.now()-tPress;
 ok(T+'AC2 "Đang lưu" shown >=600 ms', dur>=590, dur+'ms');
 ok(T+'AC3/(g) exactly one PUT for the retry + repeated clicks (requests = '+((await puts())-p0)+')', (await puts())-p0===1);
 ok(T+'AC2 fail → back to "Chưa lưu được", icon returns', (await label())==='Chưa lưu được' && await iconExists());
 ok(T+'AC2 fail → focus is on the icon', (await focusInfo()).includes('save-retry'), await focusInfo());
 ok(T+'AC4 text intact after failed retry', (await pg.inputValue(ta))===typed);
 // retry with mouse/touch: focus not lost either (mouse click on the button focuses it in Chrome)
 await pg.click(L('.save-retry')); await pg.waitForTimeout(80);
 ok(T+'(f) pointer press: focus not <body>', (await focusInfo())!=='BODY', await focusInfo());
 await pg.waitForTimeout(800);
 // AC5
 for (const a of ['export','revise','ws']){
   await pg.evaluate(()=>document.getElementById('live').scrollIntoView());
   const before=await puts();
   await pg.click(`#live [data-act=${a}]`); await pg.waitForTimeout(80);
   const l=await pg.evaluate(()=>{const e=document.querySelector('#live .act-fail'),r=e.getBoundingClientRect();return {top:r.top,bottom:r.bottom,inView:r.top>=0&&r.bottom<=innerHeight,text:e.innerText}});
   const bt=await pg.evaluate(a=>({b:document.querySelector(`#live [data-act=${a}]`).getBoundingClientRect().bottom,foc:document.activeElement.dataset.act}),a);
   ok(T+`AC5 ${a}: sentence unchanged, in viewport, under the clicked button, focus stays`, l.text==='Chưa lưu được nên thao tác này chưa chạy. Thầy cô bấm Thử lại ở đầu giáo án giúp nhé.'&&l.inView&&l.top>=bt.b-1&&bt.foc===a, JSON.stringify({gap:Math.round(l.top-bt.b)}));
   ok(T+`AC5 ${a}: no PUT`, before===await puts());
 }
 // success path
 await pg.uncheck('#fail'); await pg.focus(L('.save-retry')); await pg.keyboard.press('Enter'); await pg.waitForTimeout(1000);
 ok(T+'AC2 success → "Đã lưu", icon gone', (await label())==='Đã lưu' && !(await iconExists()));
 ok(T+'AC2 success → focus on the last edited field (textarea), not <body>', (await pg.evaluate(()=>document.activeElement.tagName))==='TEXTAREA', await focusInfo());
 ok(T+'AC5 line gone after success', (await pg.innerText('#live .act-fail'))==='');
 ok(T+'AC4 text intact after success', (await pg.inputValue(ta))===typed);
 ok(T+'no page errors', errs.length===0, errs.join(';'));
 await ctx.close();
}
const fails=res.filter(r=>r.startsWith('FAIL'));
console.log(res.join('\n')); console.log(`\n${res.length-fails.length}/${res.length} passed`);
await b.close();})();

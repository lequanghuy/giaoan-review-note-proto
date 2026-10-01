// NEW-02 QA fixes: H1 (fixed activity names) + M2 (reason line on rejected content).
// Run: NODE_PATH=/usr/local/lib/node_modules node ac-test.js        (URL=https://... to test the published page)
const { chromium } = require('playwright-core');
const URL = process.env.URL || 'file:///workspace/ga-retry-save/new02-qa-fixes/index.html';
const BANNED = /lỗi|\bsai\b|máy chủ|\b400\b|\b422\b|\b409\b|validation|undefined|\bnull\b|NaN|server|error/i;
(async()=>{
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--headless=new']});
const res=[]; const ok=(n,c,d)=>res.push((c?'PASS ':'FAIL ')+n+(d?' · '+d:''));
const RULES={'r-kn-empty':'Kiến thức','r-kn-many':'Kiến thức','r-aids-many':'Học liệu','r-content-empty':'b) Nội dung','r-content-long':'b) Nội dung','r-minutes':'Thời lượng (phút)','r-assign-empty':'Giao nhiệm vụ','r-subname-empty':'Tên hoạt động con','r-subname-long':'Tên hoạt động con','r-school-long':'Trường'};
const EXPECT={'r-kn-empty':'Cần có ít nhất một ý.','r-kn-many':'Tối đa 12 ý (ngăn bằng ; hoặc xuống dòng).','r-aids-many':'Tối đa 20 dòng.','r-content-empty':'Cần có nội dung.','r-content-long':'Tối đa 4000 ký tự.','r-minutes':'Nhập số phút từ 1 đến 180.','r-assign-empty':'Cần có nội dung.','r-subname-empty':'Cần có tên.','r-subname-long':'Tối đa 200 ký tự.','r-school-long':'Tối đa 200 ký tự.'};
const HINT_NET='Chưa lưu được nên thao tác này chưa chạy. Bấm biểu tượng thử lại ở đầu giáo án.', HINT_DATA='Chưa lưu được nên thao tác này chưa chạy. Sửa các ô có dòng nhắc bên dưới.';
for (const w of [1280,720,390]){
 const T=`[${w}] `;
 const ctx=await b.newContext({viewport:{width:w,height:800},hasTouch:w<720});
 const pg=await ctx.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
 await pg.goto(URL);
 ok(T+'page loads without script errors', errs.length===0, errs.join('|'));
 ok(T+'no horizontal overflow of the page', await pg.evaluate(()=>document.documentElement.scrollWidth<=innerWidth), String(await pg.evaluate(()=>document.documentElement.scrollWidth)));

 // ================= H1 =================
 const h=await pg.evaluate(()=>{
  const heads=[...document.querySelectorAll('.act[data-mode=heading] .act-name')];
  return heads.map(e=>({tag:e.tagName,tabindex:e.hasAttribute('tabindex'),ce:e.hasAttribute('contenteditable'),role:e.getAttribute('role'),isCtl:/INPUT|TEXTAREA|SELECT|BUTTON/.test(e.tagName),focusable:(()=>{e.focus();return document.activeElement===e})(),text:e.textContent,ro:e.hasAttribute('readonly')||e.hasAttribute('disabled')||e.hasAttribute('aria-disabled')}))});
 ok(T+'H1 4 top-level names shown as headings: Mở đầu / Hình thành kiến thức mới / Luyện tập / Vận dụng', JSON.stringify(h.map(x=>x.text).sort())===JSON.stringify(['Hình thành kiến thức mới','Luyện tập','Mở đầu','Vận vụng'.replace('vụng','dụng')].sort()), h.map(x=>x.text).join(' | '));
 ok(T+'H1 headings are <h4> (semantic), not input/textarea/button', h.length>=4 && h.every(x=>x.tag==='H4'&&!x.isCtl));
 ok(T+'H1 headings have no tabindex / contenteditable / role override / readonly / disabled / aria-disabled', h.every(x=>!x.tabindex&&!x.ce&&!x.role&&!x.ro));
 ok(T+'H1 headings are not focusable (focus() does nothing)', h.every(x=>!x.focusable));
 // Tab order: walk Tab through the "after" card; none of the stops is an h4
 await pg.evaluate(()=>{document.activeElement.blur();document.getElementById('h1-after').scrollIntoView()});
 await pg.focus('#h1-after .rv-done');
 const stops=[]; for(let i=0;i<5;i++){ await pg.keyboard.press('Tab'); stops.push(await pg.evaluate(()=>{const a=document.activeElement;return a.tagName+(a.id?'#'+a.id:'')})); }
 ok(T+'H1 Tab walk never lands on a heading (next stops are the real fields)', stops.every(s=>!s.startsWith('H4')) && /INPUT/.test(stops[0]), stops.join(' > '));
 ok(T+'H1 "after" block has NO "Tên hoạt động" label and no input with the activity name', await pg.evaluate(()=>{const c=document.querySelector('#h1-after');return !/Tên hoạt động\b(?! con)/.test(c.innerText.replace('Hoạt động','')) && ![...c.querySelectorAll('input')].some(i=>i.value==='Mở đầu')}));
 ok(T+'H1 "before" block (current) still has the input (test fixture sanity)', await pg.evaluate(()=>[...document.querySelectorAll('#h1-before input')].some(i=>i.value==='Mở đầu')));
 // sub-activity name still editable
 await pg.evaluate(()=>document.getElementById('h1-forming').scrollIntoView());
 const sub=await pg.evaluate(()=>{const i=document.querySelector('#h1-forming .sub input[type=text]');const cs=getComputedStyle(i);return {ro:i.readOnly||i.disabled,border:cs.borderTopWidth+' '+cs.borderTopColor,bg:cs.backgroundColor,tab:i.tabIndex,label:document.querySelector('label[for="'+i.id+'"]').textContent}});
 ok(T+'H1 sub-activity name is a normal input: not readonly/disabled, tabbable, visible border + white bg + its label', !sub.ro&&sub.tab===0&&sub.border==='1px rgb(229, 231, 235)'&&sub.bg==='rgb(255, 255, 255)'&&sub.label==='Tên hoạt động con', JSON.stringify(sub));
 const subSel='#h1-forming .sub input[type=text]';
 await pg.fill(subSel,''); await pg.type(subSel,'Tên mới'); ok(T+'H1 sub-activity name accepts typing', (await pg.inputValue(subSel))==='Tên mới');
 // heading look: not greyed, not input-like
 const look=await pg.evaluate(()=>{const e=document.querySelector('#h1-after .act-name');const cs=getComputedStyle(e);const lum=c=>{const m=c.match(/\d+/g).map(Number).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*m[0]+.7152*m[1]+.0722*m[2]};const L=lum(cs.color);return {fs:cs.fontSize,fw:cs.fontWeight,color:cs.color,border:cs.borderTopWidth,bg:cs.backgroundColor,pad:cs.paddingTop+' '+cs.paddingLeft,cursor:cs.cursor,opacity:cs.opacity,contrast:+((1.05)/(L+.05)).toFixed(1),lines:Math.round(e.getBoundingClientRect().height/parseFloat(cs.lineHeight))}});
 ok(T+'H1 heading style: 15px / 600 / #111827, no border, transparent bg, no padding, cursor default, opacity 1', look.fs==='15px'&&look.fw==='600'&&look.color==='rgb(17, 24, 39)'&&look.border==='0px'&&look.bg==='rgba(0, 0, 0, 0)'&&look.pad==='0px 0px'&&look.cursor==='default'&&look.opacity==='1', JSON.stringify(look));
 ok(T+'H1 heading contrast on white >= 7:1 (not greyed)', look.contrast>=7, String(look.contrast));
 ok(T+'H1 longest name "Hình thành kiến thức mới" stays on 1 line', look.lines===1 && await pg.evaluate(()=>{const e=[...document.querySelectorAll('.act-name')].find(x=>x.textContent==='Hình thành kiến thức mới');return Math.round(e.getBoundingClientRect().height/parseFloat(getComputedStyle(e).lineHeight))===1}));
 // alignment + band + no shift of what is NOT removed
 const al=await pg.evaluate(()=>{const g=(s)=>document.querySelector(s).getBoundingClientRect();const a=document.querySelector('#h1-after'),b=document.querySelector('#h1-before');
   const q=(root,s)=>root.querySelector(s).getBoundingClientRect();
   const bandA=q(a,'.act-hd'),bandB=q(b,'.act-hd'),chipA=q(a,'.rv-chip'),chipB=q(b,'.rv-chip'),hd=q(a,'.act-name'),lbA=q(a,'label'),inB=q(b,'input'),cardA=q(a,'.card'),cardB=q(b,'.card');
   return {bandH_after:bandA.height,bandH_before:bandB.height,bandTop:+(bandA.top-cardA.top-(bandB.top-cardB.top)).toFixed(2),chipDy:+((chipA.top-bandA.bottom)-(chipB.top-bandB.bottom)).toFixed(2),chipDx:+(chipA.left-chipB.left).toFixed(2),headX:+(hd.left-chipA.left).toFixed(2),labelX:+(lbA.left-chipA.left).toFixed(2),inputX:+(inB.left-chipB.left).toFixed(2),delta:+(cardA.height-cardB.height).toFixed(1),headW:hd.width,cardW:cardA.width}});
 ok(T+'H1 activity header band unchanged (height/position identical before vs after)', al.bandTop===0 && (w>720 || (al.bandH_after===48&&al.bandH_before===48)), JSON.stringify({bandH:al.bandH_after,bandTop:al.bandTop}));
 ok(T+'H1 review chips do not move (same distance to the band, same x)', al.chipDy===0&&al.chipDx===0, `dy=${al.chipDy} dx=${al.chipDx}`);
 ok(T+'H1 heading left edge == chip left edge == following label left edge (== old input left edge)', Math.abs(al.headX)<=.5&&Math.abs(al.labelX)<=.5&&Math.abs(al.inputX)<=.5, JSON.stringify({headX:al.headX,labelX:al.labelX,inputX:al.inputX}));
 ok(T+'H1 block height changes by a fixed one-time delta (label+input removed), documented', al.delta<0&&al.delta>-60, `delta=${al.delta}px`);
 if(w<=720){ ok(T+'H1 390/720: heading sits BELOW the 48px band and the chip row, inside the 14px body padding', await pg.evaluate(()=>{const a=document.querySelector('#h1-after');const band=a.querySelector('.act-hd').getBoundingClientRect(),hd=a.querySelector('.act-name').getBoundingClientRect(),act=a.querySelector('.act').getBoundingClientRect(),chip=a.querySelector('.rv-chiprow').getBoundingClientRect();return hd.top>=chip.bottom&&hd.top>band.bottom&&Math.abs(hd.left-act.left-15)<=1.5}));}
 // heading text cannot be selected-into-edit: user-select is fine; no caret
 await pg.evaluate(()=>document.getElementById('h1-after').scrollIntoView());
 const hb=await (await pg.$('#h1-after .act-name')).boundingBox(); await pg.mouse.click(hb.x+10,hb.y+8);
 ok(T+'H1 clicking the heading does not focus anything / no caret', await pg.evaluate(()=>{const a=document.activeElement;return a===document.body||!/INPUT|TEXTAREA|H4/.test(a.tagName)}));
 await pg.keyboard.type('abc'); ok(T+'H1 typing after clicking the heading changes nothing', await pg.evaluate(()=>[...document.querySelectorAll('#h1-after .act-name')].every(e=>e.textContent==='Mở đầu')));

 // ================= M2 static per rule =================
 const geoOf=async id=>pg.evaluate(id=>{const c=document.getElementById(id).querySelector('.card'),cr=c.getBoundingClientRect(),h=c.querySelector('.hd').getBoundingClientRect(),t=c.querySelector('.card-title').getBoundingClientRect(),l=c.querySelector('.save-label').getBoundingClientRect(),a=c.querySelector('.save-retry').getBoundingClientRect();return [h.height,h.top-cr.top,t.left-cr.left,l.left-cr.left,cr.right-l.right,a.width,a.height].map(v=>+v.toFixed(2)).join(',')},id);
 const g0=await geoOf('r-kn-empty'); let one=0, allSame=true, allIn=true, allLines=true, allAria=true, allCopy=true, allBanned=true, allLabel=true, allExpect=true; const info=[];
 for(const id of Object.keys(RULES)){
  await pg.evaluate(id=>document.getElementById(id).scrollIntoView({block:'center'}),id);
  const r=await pg.evaluate(id=>{const c=document.getElementById(id).querySelector('.card');const f=c.querySelector('.fld'),p=f.querySelector('.field-fail'),i=f.querySelector('.inp'),lb=f.querySelector('label'),pr=p.getBoundingClientRect();const lh=parseFloat(getComputedStyle(p).lineHeight);return {txt:p.textContent,left:pr.left,right:pr.right,top:pr.top,bottom:pr.bottom,iw:innerWidth,ih:innerHeight,lines:Math.round(pr.height/lh),inv:i.getAttribute('aria-invalid'),desc:i.getAttribute('aria-describedby'),pid:p.id,live:p.getAttribute('aria-live'),label:c.querySelector('.save-label').textContent,icon:!!c.querySelector('.save-retry'),under:pr.top>=i.getBoundingClientRect().bottom-0.5&&pr.top-i.getBoundingClientRect().bottom<=6,bc:getComputedStyle(i).borderTopColor,fldLabel:lb.textContent,hasOtherLines:c.querySelectorAll('.field-fail:not(:empty)').length,hasLabel:!!document.querySelector('label[for="'+i.id+'"]')&&lb.textContent.length>0,wrapped:pr.width}},id);
  const nm=RULES[id].replace(/ \(mỗi dòng một mục\)/,'');
  allSame = allSame && (await geoOf(id))===g0;
  allIn = allIn && r.left>=0 && r.right<=r.iw && r.top>=0 && r.bottom<=r.ih;
  allLines = allLines && r.lines>=1 && r.lines<=2;
  allAria = allAria && r.inv==='true' && r.desc===r.pid && r.live==='polite' && r.under && r.bc==='rgb(217, 119, 6)';
  allCopy = allCopy && !/Thầy cô|sửa mục|rồi thử lại|giúp nhé/.test(r.txt) && r.txt.indexOf(nm)<0 && /^[A-ZÀ-Ỹ]/.test(r.txt) && r.txt.length<=60 && r.hasLabel;
  allExpect = allExpect && r.txt===EXPECT[id]; if(r.txt!==EXPECT[id]) info.push('MISMATCH '+id+': '+r.txt); if(r.lines===1) one++;
  allBanned = allBanned && !BANNED.test(r.txt);
  allLabel = allLabel && r.label==='Chưa lưu được' && r.icon;
  info.push(`${id}:${r.lines}l`);
 }
 ok(T+'M2 each of 10 rules: error line fully inside the viewport', allIn);
 ok(T+'M2 each rule: line is 1-2 lines', allLines, info.join(' '));
 ok(T+'M2 each rule: SHORT copy (Huy 2026-10-01): capitalised, no opener, no field name, <=60 chars; the field keeps its own <label for> that is read before the line', allCopy);
 ok(T+'M2 each rule: reason text is EXACTLY the final short sentence (real limits 12 / 20 / 4000 / 1-180 / 200)', allExpect);
 ok(T+'M2 short lines: 1 line for the large majority (>=9 of 10), none over 2'+(w===390?' (390)':''), one>=9, `one-line=${one}/10`);
 ok(T+'M2 each rule: no banned word (lỗi, sai, máy chủ, 400, validation, undefined...)', allBanned);
 ok(T+'M2 each rule: aria-invalid=true, aria-describedby -> line id, line aria-live=polite, directly under field, amber border #D97706', allAria);
 ok(T+'M2 each rule: status label stays "Chưa lưu được" and the approved icon is present', allLabel);
 ok(T+'M2 status row geometry (height, title x, label x/right edge, icon 24x24) identical across all 10 rules', allSame, g0);
 const ic=await pg.evaluate(()=>{const b=document.querySelector('#icon-1 .save-retry'),cs=getComputedStyle(b);return {w:b.offsetWidth,h:b.offsetHeight,color:cs.color,border:cs.borderTopColor,radius:cs.borderTopLeftRadius,aria:b.getAttribute('aria-label'),svg:b.querySelector('svg').getBoundingClientRect().width,tip:document.querySelector('#icon-1 .save-tip').textContent}});
 ok(T+'approved icon untouched: 24x24, #92400E, border #FDE68A, radius 8, 14px glyph, aria-label & tooltip "Thử lại"', ic.w===24&&ic.h===24&&ic.color==='rgb(146, 64, 14)'&&ic.border==='rgb(253, 230, 138)'&&ic.radius==='8px'&&ic.svg===14&&ic.aria==='Thử lại'&&ic.tip==='Thử lại', JSON.stringify(ic));
 ok(T+'AC-A static hint, network/unknown field: exact short sentence', await pg.evaluate((h)=>document.querySelector('#hint-net-p').textContent===h,HINT_NET));
 ok(T+'AC-G static hint, data error with marked fields: exact short sentence', await pg.evaluate((h)=>document.querySelector('#hint-data-p').textContent===h,HINT_DATA));
 ok(T+'both hints: <=2 lines, inside viewport, no banned word', await pg.evaluate(()=>['#hint-net-p','#hint-data-p'].every(s=>{const e=document.querySelector(s),r=e.getBoundingClientRect();return Math.round(r.height/parseFloat(getComputedStyle(e).lineHeight))<=2&&r.left>=0&&r.right<=innerWidth&&!/lỗi|\bsai\b|máy chủ|\b400\b|validation|undefined/i.test(e.textContent)})));
 // multi
 const mu=await pg.evaluate(()=>{const c=document.querySelector('#multi .card');const ls=[...c.querySelectorAll('.field-fail:not(:empty)')];return {n:ls.length,inv:c.querySelectorAll('[aria-invalid=true]').length,ids:new Set(ls.map(x=>x.id)).size,vis:ls.every(l=>{const r=l.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth})}});
 ok(T+'M2 multi: 3 invalid fields -> 3 lines + 3 aria-invalid, each in viewport horizontally', mu.n===3&&mu.inv===3&&mu.ids===3&&mu.vis, JSON.stringify(mu));
 // clear steps (static)
 const cs=await pg.evaluate(()=>[1,2,3].map(n=>{const c=document.querySelector('#clr-'+n+' .card');return {line:c.querySelector('.field-fail').textContent!=='',inv:c.querySelector('.inp').hasAttribute('aria-invalid'),lab:c.querySelector('.save-label').textContent,icon:!!c.querySelector('.save-retry'),h:c.getBoundingClientRect().height}}));
 ok(T+'M2 clearing storyboard: line+aria-invalid go away on edit, label becomes "Đã lưu" and icon goes away after save', cs[0].line&&cs[0].inv&&!cs[1].line&&!cs[1].inv&&cs[1].lab==='Chưa lưu được'&&cs[1].icon&&cs[2].lab==='Đã lưu'&&!cs[2].icon, JSON.stringify(cs.map(x=>[x.line,x.inv,x.lab,x.icon])));
 const unk=await pg.evaluate(()=>{const c=document.querySelector('#net-c .card');return {lab:c.querySelector('.save-label').textContent,icon:!!c.querySelector('.save-retry'),lines:[...c.querySelectorAll('.field-fail')].filter(x=>x.textContent).length,inv:c.querySelectorAll('[aria-invalid]').length,bc:getComputedStyle(c.querySelector('.inp')).borderTopColor}});
 ok(T+'data error with UNKNOWN field: label "Chưa lưu được" + icon only; no line, no aria-invalid, normal border', unk.lab==='Chưa lưu được'&&unk.icon&&unk.lines===0&&unk.inv===0&&unk.bc==='rgb(229, 231, 235)', JSON.stringify(unk));
 // network vs data table
 ok(T+'network-vs-data table present (10 rows) and pair shows line only on the data card', await pg.evaluate(()=>document.querySelectorAll('#net-table tbody tr').length===10&&document.querySelectorAll('#net-a .field-fail:not(:empty)').length===0&&document.querySelectorAll('#net-b .field-fail:not(:empty)').length===1));
 // banned words over ALL teacher-facing text in the page (annotations [data-mock] and the table are excluded)
 const txt=await pg.evaluate(()=>{const c=document.body.cloneNode(true);c.querySelectorAll('[data-mock],#net-table,textarea,input,script,style').forEach(e=>e.remove());return c.innerText});
 const bad=txt.match(BANNED); ok(T+'no banned word anywhere in teacher-facing UI text (excl. annotations)', !bad, bad?('found: '+bad[0]):'');
 await ctx.close();

 // ================= LIVE =================
 const lc=await b.newContext({viewport:{width:w,height:800},hasTouch:w<720});
 const lp=await lc.newPage(); const le=[]; lp.on('pageerror',e=>le.push(String(e)));
 await lp.goto(URL+'?live=1'); await lp.evaluate(()=>document.getElementById('livebox').scrollIntoView());
 const lab=()=>lp.evaluate(()=>document.querySelector('#live .save-label').innerText.trim());
 const icon=()=>lp.evaluate(()=>!!document.querySelector('#live .save-retry'));
 const puts=()=>lp.evaluate(()=>+document.getElementById('cnt').textContent.replace(/\D/g,''));
 const nlines=()=>lp.evaluate(()=>[...document.querySelectorAll('#live .field-fail')].filter(x=>x.textContent).length);
 const live=s=>`#live ${s}`; const fld=k=>`#live .fld[data-key=${k}] .inp`;
 const hdG=()=>lp.evaluate(()=>{const c=document.querySelector('#live .card').getBoundingClientRect(),h=document.querySelector('#live .hd').getBoundingClientRect(),t=document.querySelector('#live .card-title').getBoundingClientRect(),l=document.querySelector('#live .save-label').getBoundingClientRect();return [h.height,h.top-c.top,t.left-c.left,l.left-c.left,c.right-l.right].map(v=>+v.toFixed(2)).join(',')});
 const pos=()=>lp.evaluate(()=>{const o={};['knowledge','school','minutes','content','subname'].forEach(k=>{const e=document.querySelector(`#live .fld[data-key=${k}] .inp`).getBoundingClientRect();o[k]=+(e.top+scrollY).toFixed(1)});const h=document.getElementById('live-h').getBoundingClientRect();o.h=+(h.top+scrollY).toFixed(1);return o});
 ok(T+'live: starts "Đã lưu", no icon, PUT 0, no lines', (await lab())==='Đã lưu'&&!(await icon())&&(await puts())===0&&(await nlines())===0);
 ok(T+'live: heading in live card is h4, no tabindex, not focusable', await lp.evaluate(()=>{const e=document.getElementById('live-h');e.focus();return e.tagName==='H4'&&!e.hasAttribute('tabindex')&&document.activeElement!==e}));
 const hd0=await hdG(), p0=await pos();
 // typing a VALID change: exactly one PUT after debounce, none during typing
 await lp.click(fld('school')); await lp.keyboard.press('End');
 for(const ch of ' Hà Nội'){ await lp.keyboard.type(ch); await lp.waitForTimeout(60); }
 ok(T+'live: no PUT while typing (valid content, debounce running)', (await puts())===0);
 await lp.waitForTimeout(1500); ok(T+'live: valid content -> 1 PUT, back to "Đã lưu"', (await puts())===1&&(await lab())==='Đã lưu');
 // invalid via typing: clear Kiến thức while focus stays on it
 await lp.click(fld('knowledge')); await lp.keyboard.press('Control+A'); await lp.keyboard.press('Delete');
 await lp.waitForTimeout(1300);
 ok(T+'live: Kiến thức emptied -> label "Chưa lưu được" + icon, 1 line, ZERO new PUT', (await lab())==='Chưa lưu được'&&(await icon())&&(await nlines())===1&&(await puts())===1);
 ok(T+'live: focus NOT stolen (still in Kiến thức) when the reason line appears', await lp.evaluate(()=>document.activeElement.closest('.fld')?.dataset.key==='knowledge'));
 const lineTxt=await lp.evaluate(()=>document.querySelector('#live .fld[data-key=knowledge] .field-fail').textContent);
 ok(T+'live: line text = "Cần có ít nhất một ý."', lineTxt==='Cần có ít nhất một ý.', lineTxt);
 ok(T+'live: field has its own label read before the line (label[for] + aria-describedby, no aria-label override needed)', await lp.evaluate(()=>{const i=document.querySelector('#live .fld[data-key=knowledge] .inp');return document.querySelector('label[for="'+i.id+'"]').textContent==='Kiến thức'&&i.getAttribute('aria-describedby')&&!i.hasAttribute('aria-label')}));
 const va=await lp.evaluate(()=>{const i=document.querySelector('#live .fld[data-key=knowledge] .inp'),p=i.closest('.fld').querySelector('.field-fail');return i.getAttribute('aria-invalid')==='true'&&i.getAttribute('aria-describedby')===p.id&&p.getAttribute('aria-live')==='polite'});
 ok(T+'live: aria-invalid + aria-describedby + polite on the live line', va);
 ok(T+'live: status row geometry identical to "Đã lưu" state (no shift of the row)', (await hdG())===hd0, hd0);
 const p1=await pos(); ok(T+'live: the field itself and everything above it did not move; the heading below moved by the same amount as the other content (only the line)', p1.knowledge===p0.knowledge&&Math.abs((p1.h-p0.h)-(p1.school-p0.school))<=.6, JSON.stringify([p0.knowledge,p1.knowledge]));
 const shift=+(p1.school-p0.school).toFixed(1); const lineH=await lp.evaluate(()=>document.querySelector('#live .fld[data-key=knowledge] .field-fail').getBoundingClientRect().height);
 ok(T+'live: content below moved by exactly the line (height + 4px margin), nothing else', Math.abs(shift-(lineH+4))<=.6, `shift=${shift} line=${lineH}`);
 // typing elsewhere while invalid: no PUT, focus stays
 await lp.click(fld('content')); await lp.keyboard.press('End');
 for(const ch of ' ok'){ await lp.keyboard.type(ch); await lp.waitForTimeout(80); }
 await lp.waitForTimeout(1300);
 ok(T+'live: typing in another field while Kiến thức is invalid -> still 0 new PUT, still "Chưa lưu được", line stays', (await puts())===1&&(await lab())==='Chưa lưu được'&&(await nlines())===1);
 ok(T+'live: focus stays in the field being typed (no focus steal)', await lp.evaluate(()=>document.activeElement.closest('.fld')?.dataset.key==='content'));
 // click Xuất while data error: approved hint text, unchanged
 await lp.click(live('[data-act=export]')); 
 await lp.click(live('[data-act=export]'));
 ok(T+'live: AC-G Xuất Word during DATA error -> "Chưa lưu được nên thao tác này chưa chạy. Sửa các ô có dòng nhắc bên dưới."', await lp.evaluate(h=>document.getElementById('live-hint').textContent===h,HINT_DATA));
 ok(T+'live: AC-G hint <=2 lines and inside the viewport', await lp.evaluate(()=>{const e=document.getElementById('live-hint'),r=e.getBoundingClientRect();return Math.round(r.height/parseFloat(getComputedStyle(e).lineHeight))<=2&&r.left>=0&&r.right<=innerWidth}));
 await lp.click(live('[data-act=revise]'));
 ok(T+'live: AC-G Soạn lại during DATA error -> same data sentence', await lp.evaluate(h=>document.getElementById('live-hint').textContent===h,HINT_DATA));
 // click retry icon with data error: no PUT, no "Đang lưu", focus to the first invalid field
 await lp.click(live('.save-retry')); await lp.waitForTimeout(900);
 ok(T+'live: icon click on data error -> no PUT, label stays "Chưa lưu được" (never flashes "Đang lưu"), icon still there', (await puts())===1&&(await lab())==='Chưa lưu được'&&(await icon()));
 ok(T+'live: icon click moves focus to the first field with a reason line (Kiến thức)', await lp.evaluate(()=>document.activeElement.closest('.fld')?.dataset.key==='knowledge'));
 // multi
 await lp.click('#h-long'); await lp.click('#h-min'); await lp.waitForTimeout(1200);
 ok(T+'live: 3 invalid fields -> 3 lines at once, 3 aria-invalid, 0 PUT', (await nlines())===3&&(await lp.evaluate(()=>document.querySelectorAll('#live [aria-invalid=true]').length))===3&&(await puts())===1);
 const ml=await lp.evaluate(()=>[...document.querySelectorAll('#live .field-fail')].filter(x=>x.textContent).map(l=>{const r=l.getBoundingClientRect();return [Math.round(r.left),Math.round(r.right),innerWidth,+(r.height/parseFloat(getComputedStyle(l).lineHeight)).toFixed(2)]}));ok(T+'live: all 3 lines inside viewport width and <=2 lines each', ml.every(x=>x[0]>=0&&x[1]<=x[2]&&Math.round(x[3])<=2), JSON.stringify(ml));
 // clear on fix: fix minutes only, instantly
 await lp.fill(fld('minutes'),'20'); await lp.waitForTimeout(40);
 ok(T+'live: fixing one field clears ITS line immediately (<=40ms, before any save); the other 2 stay', (await nlines())===2&&await lp.evaluate(()=>!document.querySelector('#live .fld[data-key=minutes] .inp').hasAttribute('aria-invalid')&&!document.querySelector('#live .fld[data-key=minutes] .inp').hasAttribute('aria-describedby')));
 ok(T+'live: still no PUT while 2 fields remain invalid', (await puts())===1);
 await lp.click('#h-fix'); await lp.waitForTimeout(100);
 ok(T+'live: all fixed -> all lines gone at once', (await nlines())===0&&(await lp.evaluate(()=>document.querySelectorAll('#live [aria-invalid]').length))===0);
 await lp.waitForTimeout(1600);
 ok(T+'live: after the last fix: auto-save -> exactly 1 more PUT, "Đã lưu", icon gone', (await puts())===2&&(await lab())==='Đã lưu'&&!(await icon()));
 const p2=await pos(); ok(T+'live: positions return to the original after clearing (no residual space)', Math.abs(p2.school-p0.school)<=.6&&Math.abs(p2.content-p0.content)<=.6, JSON.stringify(p2));
 // network error flow stays as approved
 await lp.evaluate(()=>{document.getElementById('fail').checked=true});
 await lp.click(fld('school')); await lp.keyboard.type('x'); await lp.waitForTimeout(1500);
 ok(T+'live: NETWORK error -> "Chưa lưu được" + icon, NO reason line, no aria-invalid, 1 PUT sent', (await lab())==='Chưa lưu được'&&(await icon())&&(await nlines())===0&&(await puts())===3&&await lp.evaluate(()=>document.querySelectorAll('#live [aria-invalid]').length===0));
 await lp.click(live('.save-retry')); await lp.waitForTimeout(150);
 ok(T+'live: NETWORK retry shows "Đang lưu" (approved flow) and sends a PUT', (await lab())==='Đang lưu'&&(await puts())===4);
 await lp.waitForTimeout(900); ok(T+'live: NETWORK retry fails again -> icon back', (await lab())==='Chưa lưu được'&&(await icon()));
 await lp.evaluate(()=>{document.getElementById('fail').checked=false}); await lp.click(live('.save-retry')); await lp.waitForTimeout(1000);
 ok(T+'live: NETWORK retry succeeds -> "Đã lưu", icon gone, focus back to the last edited field', (await lab())==='Đã lưu'&&!(await icon())&&await lp.evaluate(()=>document.activeElement.closest('.fld')?.dataset.key==='school'));
 // AC-A: hint on NETWORK error (network still down from earlier step? set explicitly)
 await lp.evaluate(()=>{document.getElementById('fail').checked=true;document.getElementById('rej').checked=false});
 await lp.click(fld('school')); await lp.keyboard.type('n'); await lp.waitForTimeout(1500);
 await lp.click(live('[data-act=export]'));
 ok(T+'live: AC-A Xuất Word during NETWORK error -> "Chưa lưu được nên thao tác này chưa chạy. Bấm biểu tượng thử lại ở đầu giáo án."', (await lab())==='Chưa lưu được'&&await lp.evaluate(h=>document.getElementById('live-hint').textContent===h,HINT_NET));
 await lp.evaluate(()=>{document.getElementById('fail').checked=false}); await lp.click(live('.save-retry')); await lp.waitForTimeout(1000);
 ok(T+'live: hint disappears after a successful save', await lp.evaluate(()=>document.getElementById('live-hint').textContent===''));
 // minutes are NOT silently changed to 1 (L1)
 await lp.fill(fld('minutes'),''); await lp.waitForTimeout(1300);
 ok(T+'live: L1 minutes emptied stays EMPTY (not snapped to 1) and shows "Nhập số phút từ 1 đến 180."', (await lp.inputValue(fld('minutes')))===''&&await lp.evaluate(()=>document.querySelector('#live .fld[data-key=minutes] .field-fail').textContent==='Nhập số phút từ 1 đến 180.'));
 await lp.fill(fld('minutes'),'0'); ok(T+'live: minutes 0 stays 0 with the line', (await lp.inputValue(fld('minutes')))==='0'&&(await nlines())===1);
 await lp.fill(fld('minutes'),'10'); await lp.waitForTimeout(1300);
 // data error, field unknown: label + icon only, approved retry flow, no invented line
 await lp.evaluate(()=>{document.getElementById('fail').checked=false;document.getElementById('rej').checked=true});
 const pu=await puts(); await lp.click(fld('school')); await lp.keyboard.type('y'); await lp.waitForTimeout(1500);
 ok(T+'live: server rejects, field unknown -> "Chưa lưu được" + icon, NO line, NO aria-invalid, 1 PUT sent', (await lab())==='Chưa lưu được'&&(await icon())&&(await nlines())===0&&(await puts())===pu+1&&await lp.evaluate(()=>document.querySelectorAll('#live [aria-invalid]').length===0));
 await lp.click(live('.save-retry')); await lp.waitForTimeout(150);
 ok(T+'live: unknown-field rejection, icon click -> approved flow ("Đang lưu", PUT sent)', (await lab())==='Đang lưu'&&(await puts())===pu+2);
 await lp.waitForTimeout(900); ok(T+'live: still rejected -> icon back, still no line', (await lab())==='Chưa lưu được'&&(await icon())&&(await nlines())===0);
 await lp.evaluate(()=>{document.getElementById('rej').checked=false}); await lp.click(live('.save-retry')); await lp.waitForTimeout(1000);
 ok(T+'live: after the rejection stops -> "Đã lưu", icon gone', (await lab())==='Đã lưu'&&!(await icon()));
 // data error then network error at once: data wins for the line, no PUT
 await lp.evaluate(()=>{document.getElementById('fail').checked=true}); await lp.click('#h-sub'); await lp.waitForTimeout(1300);
 const ps=await puts();
 ok(T+'live: sub-activity name emptied -> its own line, 0 PUT even though network is also down', (await nlines())===1&&await lp.evaluate(()=>document.querySelector('#live .fld[data-key=subname] .field-fail').textContent==='Cần có tên.'));
 await lp.click(fld('subname')); await lp.keyboard.type('Tên con'); await lp.waitForTimeout(40);
 ok(T+'live: typing in the sub-activity name clears its line instantly', (await nlines())===0);
 await lp.waitForTimeout(1500);
 ok(T+'live: then the (still failing) network is the only error: label "Chưa lưu được", no line', (await lab())==='Chưa lưu được'&&(await nlines())===0&&(await puts())===ps+1);
 ok(T+'live: no script errors', le.length===0, le.join('|'));
 await lc.close();
}
await b.close();
const fails=res.filter(r=>r.startsWith('FAIL')); console.log(res.join('\n')); console.log(`\n${res.length-fails.length}/${res.length} passed`+(fails.length?`, ${fails.length} FAILED`:'')); process.exit(fails.length?1:0);
})();

const STATES=[
  {id:'main',label:'1. Chính'},
  {id:'missing',label:'2. Thiếu ô'},
  {id:'invalid',label:'3. Email sai dạng'},
  {id:'wrong',label:'4. Sai mật khẩu'},
  {id:'loading',label:'5. Đang vào'},
  {id:'forgot',label:'6. Quên MK'},
  {id:'forgot-sent',label:'7. Đã gửi link'},
  {id:'register',label:'8. Tạo tài khoản'},
];
const Q=new URLSearchParams(location.search);
let state=Q.get('state')||'main';
if(Q.get('motion')==='reduce') document.documentElement.classList.add('rm');

const GSVG=`<svg class="g" viewBox="0 0 18 18" aria-hidden="true"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>`;

function eye(open){
  return open
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A10.4 10.4 0 0121 12a10.5 10.5 0 01-4.2 5.3M6.1 6.1A10.5 10.5 0 003 12a10.4 10.4 0 0011.1 6.9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/></svg>`;
}

function brand(sub){
  return `<div class="brand">
    <div class="logo-mark" aria-hidden="true">G</div>
    <h1>GiaoAn AI</h1>
    <p class="sub">${sub||'Soạn kế hoạch bài dạy theo khung Phụ lục IV'}</p>
  </div>`;
}

function field(opts){
  const {id,label,type,name,autocomplete,value,placeholder,invalid,reason,pw}=opts;
  const inv=invalid?` class="inp field-invalid" aria-invalid="true" aria-describedby="${id}-why"`:` class="inp"`;
  const why=invalid?`<p class="field-fail" id="${id}-why" aria-live="polite">${reason||''}</p>`:`<p class="field-fail" id="${id}-why" aria-live="polite"></p>`;
  if(pw){
    return `<div class="field">
      <label class="lb" for="${id}">${label}</label>
      <div class="pw-wrap">
        <input${inv} id="${id}" name="${name||id}" type="password" autocomplete="${autocomplete||'current-password'}" value="${value||''}" placeholder="${placeholder||''}" spellcheck="false"/>
        <button type="button" class="pw-toggle" data-for="${id}" aria-label="Hiện mật khẩu" aria-pressed="false">${eye(false)}</button>
      </div>
      ${why}
    </div>`;
  }
  return `<div class="field">
    <label class="lb" for="${id}">${label}</label>
    <input${inv} id="${id}" name="${name||id}" type="${type||'email'}" autocomplete="${autocomplete||'email'}" inputmode="${type==='email'||!type?'email':'text'}" value="${value||''}" placeholder="${placeholder||''}" spellcheck="false"/>
    ${why}
  </div>`;
}

function googleBtn(disabled){
  return `<button type="button" class="btn btn-g" ${disabled?'disabled':''} data-google>
    ${GSVG}<span>Đăng nhập bằng Google</span>
  </button>`;
}

function mvpNote(){
  return `<div class="mvp"><b>MVP</b> (đề xuất) · email + mật khẩu · Google · quên mật khẩu gửi link · tạo tài khoản tối thiểu.
  <ul><li><b>Sau:</b> tên đăng nhập thay email · OTP · SSO trường · 2FA · magic link · đặt lại MK trong app</li></ul></div>`;
}

function renderMain(opts={}){
  const {missing,invalid,wrong,loading}=opts;
  const emailInv=missing||invalid;
  const pwInv=missing;
  const emailWhy=missing?'Cần có email.':(invalid?'Nhập email đúng dạng, ví dụ ten@truong.edu.vn.':'');
  const pwWhy=missing?'Cần có mật khẩu.':'';
  const alert=wrong?`<div class="alert" role="alert" tabindex="-1" id="errSum" aria-labelledby="errTitle">
      <h2 id="errTitle">Chưa đăng nhập được</h2>
      <p>Email hoặc mật khẩu chưa khớp. Kiểm tra lại hoặc dùng Google.</p>
    </div>`:(missing||invalid?`<div class="alert" role="alert" tabindex="-1" id="errSum" aria-labelledby="errTitle">
      <h2 id="errTitle">Chưa điền đủ</h2>
      <ul>
        ${missing||invalid?`<li><a href="#email">Email</a></li>`:''}
        ${missing?`<li><a href="#password">Mật khẩu</a></li>`:''}
      </ul>
    </div>`:'');
  return `${brand()}
    ${alert}
    <form id="loginForm" novalidate>
      ${field({id:'email',label:'Email',type:'email',autocomplete:'username email',value:invalid?'gv@':(missing?'':'gv@truongthcs.edu.vn'),invalid:emailInv,reason:emailWhy})}
      ${field({id:'password',label:'Mật khẩu',pw:true,autocomplete:'current-password',value:missing?'':'••••••••',invalid:pwInv,reason:pwWhy})}
      <button type="submit" class="btn btn-p" ${loading?'disabled aria-busy="true"':''} id="submitBtn">
        ${loading?`<span class="spin" aria-hidden="true"></span><span>Đang đăng nhập…</span>`:'Đăng nhập'}
      </button>
    </form>
    <div class="div" role="separator" aria-label="hoặc">hoặc</div>
    ${googleBtn(loading)}
    <div class="links">
      <a href="?state=forgot" data-go="forgot">Quên mật khẩu?</a>
      <span></span>
    </div>
    <p class="foot">Chưa có tài khoản? <a href="?state=register" data-go="register">Tạo tài khoản</a></p>
    ${mvpNote()}`;
}

function renderForgot(){
  return `<button type="button" class="back" data-go="main">← Về đăng nhập</button>
    ${brand('Gửi link đặt lại mật khẩu tới email của bạn.')}
    <form id="forgotForm" novalidate>
      ${field({id:'email',label:'Email',type:'email',autocomplete:'email',value:'gv@truongthcs.edu.vn'})}
      <button type="submit" class="btn btn-p">Gửi link</button>
    </form>
    <p class="hint">MVP: chỉ gửi link email. Đặt lại mật khẩu trên trang link (ngoài app) — chưa có màn đổi MK trong app.</p>`;
}

function renderForgotSent(){
  return `<button type="button" class="back" data-go="main">← Về đăng nhập</button>
    ${brand()}
    <div class="ok" role="status">
      <h2>Đã gửi link</h2>
      <p>Nếu email có trong hệ thống, bạn sẽ nhận link trong vài phút. Kiểm tra cả hộp thư rác.</p>
    </div>
    <button type="button" class="btn" data-go="main">Về đăng nhập</button>
    <p class="hint">Câu xác nhận không nói email có tồn tại hay không (tránh lộ tài khoản).</p>`;
}

function renderRegister(){
  return `<button type="button" class="back" data-go="main">← Về đăng nhập</button>
    ${brand('Tạo tài khoản miễn phí · Toán THCS.')}
    <form id="regForm" novalidate>
      ${field({id:'email',label:'Email',type:'email',autocomplete:'email',value:''})}
      ${field({id:'password',label:'Mật khẩu',pw:true,autocomplete:'new-password',value:''})}
      ${field({id:'password2',label:'Nhập lại mật khẩu',pw:true,autocomplete:'new-password',value:''})}
      <button type="submit" class="btn btn-p">Tạo tài khoản</button>
    </form>
    <div class="div" role="separator" aria-label="hoặc">hoặc</div>
    ${googleBtn(false)}
    <p class="foot">Đã có tài khoản? <a href="?state=main" data-go="main">Đăng nhập</a></p>
    <div class="mvp"><b>MVP</b>: email + mật khẩu (+ nhập lại) hoặc Google.
    <ul><li><b>Sau:</b> số điện thoại / OTP · SSO trường · bắt buộc xác nhận email trước khi soạn</li></ul></div>`;
}

function htmlFor(s){
  if(s==='missing') return renderMain({missing:true});
  if(s==='invalid') return renderMain({invalid:true});
  if(s==='wrong') return renderMain({wrong:true});
  if(s==='loading') return renderMain({loading:true});
  if(s==='forgot') return renderForgot();
  if(s==='forgot-sent') return renderForgotSent();
  if(s==='register') return renderRegister();
  return renderMain({});
}

function setState(s,{push=true}={}){
  state=s;
  if(push){
    const u=new URL(location.href); u.searchParams.set('state',s);
    if(document.documentElement.classList.contains('rm')) u.searchParams.set('motion','reduce');
    else u.searchParams.delete('motion');
    history.replaceState(null,'',u);
  }
  document.getElementById('panel').innerHTML=htmlFor(s);
  document.querySelectorAll('#stateBtns button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.state===s?'true':'false'));
  bind();
  const sum=document.getElementById('errSum');
  if(sum){ try{sum.focus()}catch(e){} }
}

function bind(){
  document.querySelectorAll('[data-go]').forEach(el=>{
    el.addEventListener('click',e=>{e.preventDefault();setState(el.getAttribute('data-go'))});
  });
  document.querySelectorAll('.pw-toggle').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id=btn.getAttribute('data-for');
      const inp=document.getElementById(id);
      const show=inp.type==='password';
      inp.type=show?'text':'password';
      btn.setAttribute('aria-pressed',show?'true':'false');
      btn.setAttribute('aria-label',show?'Ẩn mật khẩu':'Hiện mật khẩu');
      btn.innerHTML=eye(show);
    });
  });
  const lf=document.getElementById('loginForm');
  if(lf) lf.addEventListener('submit',e=>{
    e.preventDefault();
    if(state==='loading') return;
    setState('loading');
    setTimeout(()=>setState('wrong'),1600);
  });
  const ff=document.getElementById('forgotForm');
  if(ff) ff.addEventListener('submit',e=>{e.preventDefault();setState('forgot-sent')});
  const rf=document.getElementById('regForm');
  if(rf) rf.addEventListener('submit',e=>{e.preventDefault();setState('main')});
  document.querySelectorAll('[data-google]').forEach(b=>b.addEventListener('click',()=>{
    /* Mock only — không gọi Google thật */
    b.setAttribute('aria-busy','true');
    b.disabled=true;
    b.querySelector('span').textContent='Đang mở Google…';
  }));
}

const bar=document.getElementById('stateBtns');
STATES.forEach(s=>{
  const b=document.createElement('button');
  b.type='button'; b.dataset.state=s.id; b.textContent=s.label;
  b.addEventListener('click',()=>setState(s.id));
  bar.appendChild(b);
});
document.getElementById('rm').checked=document.documentElement.classList.contains('rm');
document.getElementById('rm').addEventListener('change',e=>{
  document.documentElement.classList.toggle('rm',e.target.checked);
  setState(state);
});
setState(state,{push:false});

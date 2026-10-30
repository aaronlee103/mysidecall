(function(){
var KO={
"nav.help":"뭐 하는 곳이에요?",
"intro.copy":"상자를 돌려 보세요.<br>착해요.","intro.s1":"안녕하세요","intro.s2":"어떤 언어든","intro.s3":"당신의 전화","intro.go":"들어가기","intro.skip":"건너뛰기",
"hero.h1":"영어 전화,<br>AI가 대신 겁니다.",
"hero.cta":"전화 걸기",
"hero.whisper":"한국어로 부탁하면, 영어로 통화합니다.",
"a.muse":"Muse에게 전화 부탁","a.mcp":"내 에이전트 연결",
"foot.meta":"Meta Muse Spark · Muse Voice로 만들었습니다","foot.privacy":"개인정보","foot.terms":"약관",
"s.h":"My Side Call은 이런 것",
"s.1t":"필요한 걸 적습니다","s.1d":"한국어·스페인어·일본어·중국어·영어 아무거나. 고지서 사진을 찍으면 계좌번호와 금액을 대신 읽어 둡니다.",
"s.2t":"AI가 실제로 전화를 겁니다","s.2d":"미국 번호 어디든, 자연스러운 영어로. 첫 문장에서 AI 비서임과 녹음될 수 있음을 밝힙니다.",
"s.3t":"결정은 물어보고 합니다","s.3d":"다른 시간, 추가 요금처럼 부탁에 없던 건 화면에 한국어로 질문이 옵니다. 답할 때까지 AI가 전화를 붙들고 있습니다.",
"s.4t":"끝나면 한국어 요약","s.4d":"합의된 것, 남은 것, 달력에 적을 것 — 녹음과 깨끗한 전사본까지.",
"s.5t":"다른 AI도 쓸 수 있습니다","s.5d":"Muse, Claude, 어떤 에이전트든 연결해서 대신 전화를 걸게 하거나 — 모닝콜·알림·결과 보고처럼 나에게 걸게 할 수 있습니다.",
"s.6t":"Meta로 만들었습니다","s.6d":"대화·요약·고지서 읽기는 Muse Spark, 녹음 재전사는 Muse Voice Transcribe, 로그인은 Facebook Login.",
"s.7t":"하지 않는 것","s.7d":"응급(911), 의료·법률 판단 통화, 그리고 승인하지 않은 어떤 것에도 동의하지 않습니다.",
"s.8t":"앞으로","s.8d":"지금: 내 언어 → 영어, 미국 안에서. 다음: 영어 → 어떤 언어든, 어느 나라든. 나중: 두 사람, 두 언어, 한 통화."
};
var EN={};
document.querySelectorAll('[data-i18n],[data-i18n-html]').forEach(function(el){
  var k=el.getAttribute('data-i18n')||el.getAttribute('data-i18n-html');
  if(!(k in EN)) EN[k]=el.hasAttribute('data-i18n-html')?el.innerHTML:el.textContent;
});
function apply(lang){
  var D=lang==='ko'?KO:EN;
  document.querySelectorAll('[data-i18n]').forEach(function(el){var k=el.getAttribute('data-i18n');if(D[k]!=null)el.textContent=D[k];});
  document.querySelectorAll('[data-i18n-html]').forEach(function(el){var k=el.getAttribute('data-i18n-html');if(D[k]!=null)el.innerHTML=D[k];});
  document.querySelectorAll('#lang [data-lang]').forEach(function(s){s.classList.toggle('on',s.getAttribute('data-lang')===lang);});
  document.documentElement.lang=lang;
  try{localStorage.setItem('msc_lang',lang);}catch(e){}
}
var saved=null; try{saved=localStorage.getItem('msc_lang');}catch(e){}
apply(saved||((navigator.language||'').toLowerCase().indexOf('ko')===0?'ko':'en'));
document.getElementById('lang').addEventListener('click',function(){apply(document.documentElement.lang==='ko'?'en':'ko');});

// explainer sheet
var sheet=document.getElementById('sheet'),help=document.getElementById('help'),close=document.getElementById('close');
function open(){sheet.hidden=false;document.body.style.overflow='hidden';close.focus();}
function shut(){sheet.hidden=true;document.body.style.overflow='';help.focus();}
help.addEventListener('click',open);close.addEventListener('click',shut);
sheet.addEventListener('click',function(e){if(e.target===sheet)shut();});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!sheet.hidden)shut();});
if(location.hash==='#about')open();

// ── intro cube ──
(function(){
  var intro=document.getElementById('intro'),stage=document.getElementById('stage'),cube=document.getElementById('cube');
  if(!intro) return;
  var seen=null; try{seen=sessionStorage.getItem('msc_intro');}catch(e){}
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(seen||location.hash==='#about'){intro.classList.add('hide');return;}
  document.body.style.overflow='hidden';
  var rx=-18,ry=28,vx=0,vy=0.25,drag=false,lx=0,ly=0,raf;
  function render(){cube.style.transform='rotateX('+rx+'deg) rotateY('+ry+'deg)';}
  function tick(){
    if(!drag){ry+=vy;rx+=vx;vx*=0.96;vy=vy*0.96+(Math.abs(vy)<0.25?0.01*Math.sign(vy||1):0);}
    render(); raf=requestAnimationFrame(tick);
  }
  if(!reduce) raf=requestAnimationFrame(tick); else render();
  function down(e){drag=true;stage.classList.add('grabbing');var p=e.touches?e.touches[0]:e;lx=p.clientX;ly=p.clientY;vx=vy=0;}
  function move(e){if(!drag)return;var p=e.touches?e.touches[0]:e;var dx=p.clientX-lx,dy=p.clientY-ly;lx=p.clientX;ly=p.clientY;ry+=dx*0.5;rx-=dy*0.5;rx=Math.max(-80,Math.min(80,rx));vy=dx*0.5;vx=-dy*0.5;render();}
  function up(){drag=false;stage.classList.remove('grabbing');}
  stage.addEventListener('mousedown',down);window.addEventListener('mousemove',move);window.addEventListener('mouseup',up);
  stage.addEventListener('touchstart',down,{passive:true});window.addEventListener('touchmove',move,{passive:true});window.addEventListener('touchend',up);
  // gentle follow of the mouse when not dragging
  window.addEventListener('mousemove',function(e){if(drag)return;var cx=innerWidth/2,cy=innerHeight/2;vy=vy*0.9+((e.clientX-cx)/cx)*0.15;vx=vx*0.9+(-(e.clientY-cy)/cy)*0.08;});
  function go(){try{sessionStorage.setItem('msc_intro','1');}catch(e){}cancelAnimationFrame(raf);intro.classList.add('hide');document.body.style.overflow='';}
  document.getElementById('intro-go').addEventListener('click',go);
  document.getElementById('intro-skip').addEventListener('click',go);
  document.addEventListener('keydown',function(e){if(!intro.classList.contains('hide')&&(e.key==='Enter'||e.key==='Escape'))go();});
})();
})();

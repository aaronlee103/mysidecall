(function(){
var KO={
"nav.help":"뭐 하는 곳이에요?",
"intro.copy":"인사해 보세요.<br>어떤 언어로든.","intro.go":"들어가기","intro.skip":"건너뛰기",
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

// ── intro: a white cube drifting through space, then following the mouse ──
(function(){
  var intro=document.getElementById('intro'),stage=document.getElementById('stage'),cube=document.getElementById('cube'),pops=document.getElementById('pops');
  if(!intro) return;
  var seen=null; try{seen=sessionStorage.getItem('msc_intro');}catch(e){}
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(seen||location.hash==='#about'){intro.classList.add('hide');return;}
  document.body.style.overflow='hidden';

  // size
  var S=Math.min(Math.min(innerWidth,innerHeight)*0.5,420); stage.style.setProperty('--s',S+'px');
  // position & drift (space): slow velocity, soft bounce off walls
  var px=innerWidth*0.6-S/2, py=innerHeight*0.5-S/2, pvx=0.35, pvy=0.22;
  // rotation: free tumble
  var rx=-18, ry=28, wx=0.18, wy=0.32, drag=false, lx=0, ly=0, raf, following=false, mx=0, my=0;
  function render(){
    stage.style.transform='translate3d('+px+'px,'+py+'px,0)';
    cube.style.transform='rotateX('+rx+'deg) rotateY('+ry+'deg)';
  }
  function tick(){
    if(!drag){
      if(following){
        // ease toward the pointer, keep tumbling gently
        px+=((mx-S/2)-px)*0.04; py+=((my-S/2)-py)*0.04;
        px=Math.max(24,Math.min(innerWidth-S-24,px)); py=Math.max(110,Math.min(innerHeight-S-110,py));
        wx*=0.985; wy*=0.985; if(Math.abs(wy)<0.12) wy=0.12*Math.sign(wy||1);
      } else {
        px+=pvx; py+=pvy;
        var minX=24, maxX=innerWidth-S-24, minY=110, maxY=innerHeight-S-110;
        if(px<minX){px=minX;pvx=Math.abs(pvx);} if(px>maxX){px=maxX;pvx=-Math.abs(pvx);}
        if(py<minY){py=minY;pvy=Math.abs(pvy);} if(py>maxY){py=maxY;pvy=-Math.abs(pvy);}
      }
      rx+=wx; ry+=wy;
    }
    render(); raf=requestAnimationFrame(tick);
  }
  render(); if(!reduce) raf=requestAnimationFrame(tick);

  // pointer: first movement switches to "follow"; drag spins
  function pt(e){var p=e.touches?e.touches[0]:e;return {x:p.clientX,y:p.clientY};}
  window.addEventListener('mousemove',function(e){ mx=e.clientX; my=e.clientY; following=true;
    if(drag){var dx=mx-lx,dy=my-ly;lx=mx;ly=my;ry+=dx*0.5;rx-=dy*0.5;wy=dx*0.4;wx=-dy*0.4;render();}
  });
  function down(e){drag=true;stage.classList.add('grabbing');var p=pt(e);lx=p.x;ly=p.y;}
  function up(){drag=false;stage.classList.remove('grabbing');}
  stage.addEventListener('mousedown',down); window.addEventListener('mouseup',up);
  stage.addEventListener('touchstart',function(e){down(e);},{passive:true});
  window.addEventListener('touchmove',function(e){var p=pt(e);mx=p.x;my=p.y;following=true;if(drag){var dx=mx-lx,dy=my-ly;lx=mx;ly=my;ry+=dx*0.5;rx-=dy*0.5;wy=dx*0.4;wx=-dy*0.4;render();}},{passive:true});
  window.addEventListener('touchend',up);
  window.addEventListener('resize',function(){S=Math.min(Math.min(innerWidth,innerHeight)*0.5,420);stage.style.setProperty('--s',S+'px');});

  // greeting pops: a word bursts somewhere every ~450ms
  var HI=['Hello','안녕하세요','Hola','Bonjour','こんにちは','你好','Olá','Ciao','Hallo','नमस्ते','مرحبا','Xin chào','Привет','Merhaba','Sawubona','Hej','Halo','Γεια','שלום','Salam','สวัสดี','Jambo','Kia ora','Aloha'];
  var i=0, popTimer=null;
  function pop(){
    if(reduce) return;
    var el=document.createElement('span'); el.className='pop c'+(1+(i%5)); el.textContent=HI[i%HI.length]; i++;
    el.style.left=(6+Math.random()*88)+'%'; el.style.top=(10+Math.random()*78)+'%'; el.style.setProperty('--pr',(Math.random()*24-12)+'deg');
    var big=Math.random()<0.22; el.style.setProperty('--ps', big?(2.2+Math.random()*1.6).toFixed(2):(0.6+Math.random()*1.0).toFixed(2)); el.style.setProperty('--pd',(1.2+Math.random()*1.2).toFixed(2)+'s');
    pops.appendChild(el); setTimeout(function(){el.remove();},2500);
    popTimer=setTimeout(pop, 260+Math.random()*300);
  }
  setTimeout(pop,500);

  function go(){try{sessionStorage.setItem('msc_intro','1');}catch(e){}cancelAnimationFrame(raf);clearTimeout(popTimer);intro.classList.add('hide');document.body.style.overflow='';}
  document.getElementById('intro-go').addEventListener('click',go);
  document.getElementById('intro-skip').addEventListener('click',go);
  document.addEventListener('keydown',function(e){if(!intro.classList.contains('hide')&&(e.key==='Enter'||e.key==='Escape'))go();});
})();
})();

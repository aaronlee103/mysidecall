(function(){
var KO={
"nav.help":"뭐 하는 곳이에요?",
"hero.h1":"영어 전화,<br>AI가 대신 겁니다.",
"hero.cta":"전화 걸기",
"hero.whisper":"한국어로 부탁하면, 영어로 통화합니다.",
"q.1":"식당 예약","q.2":"고객센터","q.3":"집주인","q.4":"여행",
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
})();

(function(){
var KO={
"nav.how":"이용 방법","nav.meta":"Meta 기반","nav.try":"전화 걸기","nav.dev":"에이전트용","nav.cta":"전화 걸기 ↗",
"hero.eyebrow":"당신의 목소리, 어디서나",
"hero.h1":"영어 전화,<br>AI가 <em>대신</em> 겁니다.",
"hero.lead":"영어로 전화하는 게 부담스러우세요? 하고 싶은 말을 한국어로 적어 주세요. AI가 실제로 전화를 걸어 영어로 대화하고, 중간에 결정할 일이 생기면 화면으로 물어본 뒤, 끝나면 한국어 요약을 드립니다.",
"hero.cta1":"실제 전화 걸기 ↗","hero.cta2":"이용 방법 보기 →",
"hero.micro":"미국 전화번호로 실제 통화 · 사람과 AI 에이전트 모두를 위해 · Meta Muse Spark · Muse Voice 기반",
"meta.eyebrow":"Meta 모델로 만들었습니다","meta.h2":"전화 한 통에 Meta 모델 셋.",
"meta.sub":"My Side Call은 처음부터 끝까지 Meta Model API 위에서 돌아갑니다 — 전화기 너머의 대화, 당신이 읽는 요약, 대신 읽어 주는 고지서까지. 로그인은 이미 쓰는 계정으로.",
"meta.1p":"통화의 두뇌. 상대와 영어로 대화하고, 언제 멈춰서 당신에게 물어볼지 판단하고, 끝나면 요약과 할 일을 당신의 언어로 씁니다. 사진으로 올린 고지서·편지도 읽어 줍니다.",
"meta.2p":"통화가 끝나면 녹음을 Meta의 음성 모델로 다시 받아써, 문장부호까지 정리된 깨끗한 전사본을 보관·검색할 수 있습니다.",
"meta.3p":"한 번 눌러 로그인. 통화 기록·대화 내용·요약은 내 계정에만 묶이고, 새로 외울 비밀번호가 없습니다.",
"hero.float1":"🌎 한국어로 부탁하세요","hero.float2":"대화는 AI가 맡습니다",
"strip.1":"✦ 부탁하면","strip.2":"☎ 전화하고","strip.3":"↔ 중간에 물어보고","strip.4":"✓ 결정은 당신이",
"how.eyebrow":"단순하게","how.h2":"부탁 한 번. 실제 대화 한 통.",
"how.sub":"치과 예약부터 케이블 요금 환불까지, 가장 하기 싫은 '전화'만 My Side Call이 맡고 결정은 전부 당신이 합니다.",
"how.1h":"01. 필요한 걸 말해 주세요","how.1p":"생각나는 언어로 그대로 적으세요. 고지서나 편지를 사진으로 올리면 계정번호·금액을 알아서 읽어 둡니다.",
"how.2h":"02. AI가 전화를 겁니다","how.2p":"자연스러운 영어로 실제 통화. 목표와 한도, 합의하면 안 되는 것까지 알고 전화합니다.",
"how.3h":"03. 중간에 꼭 물어봅니다","how.3p":"상대가 다른 시간, 추가 요금처럼 새로운 제안을 하면 AI가 잠시 멈추고 화면으로 한국어로 묻습니다. 답하시면 그대로 이어서 통화합니다.",
"demo.eyebrow":"여기서 시작","demo.h2":"어떤 전화를 대신 걸어 드릴까요?",
"demo.p":"친구에게 말하듯 적어 주세요. 다음 화면에서 전화번호만 넣으면 몇 초 안에 통화가 시작되고, 실시간 대화 내용과 AI의 질문을 화면에서 보실 수 있습니다.",
"demo.tag":"실제 통화 · 미국 번호 · 한국어 요약",
"demo.panel":"부탁 내용 적기","demo.lang":"내 언어","demo.topic":"어떤 전화인가요?",
"demo.t1":"예약 잡기·변경","demo.t2":"식당 예약","demo.t3":"고객센터 (요금·환불·해지)","demo.t4":"기타",
"demo.req":"부탁 내용","demo.ph":"예: 치과에 전화해서 화요일 스케일링을 다음 주 오후로 옮겨 줘. 시간을 제안하면 나한테 먼저 물어봐.",
"demo.btn":"전화 걸러 가기 →","demo.note":"응급(911)·의료·법률 판단이 필요한 전화는 지원하지 않습니다.",
"dev.eyebrow":"에이전트를 위해서도","dev.h2":"AI 에이전트에게 전화를 주세요.",
"dev.p":"My Side Call은 커넥터(MCP 서버)이기도 합니다. Claude, Muse, 직접 만든 에이전트 어느 것이든 실제 전화를 걸고, 대화 내용을 받고, 중간 질문에 답하고, 주인에게 모닝콜이나 안부 전화를 걸 수 있습니다. 안전 규칙은 동일합니다.",
"dev.cta":"GitHub에서 문서 보기 →",
"faq.eyebrow":"알아 두세요","faq.h2":"자주 묻는 질문",
"faq.1q":"정말 전화가 걸리나요?","faq.1a":"네. 실제 미국 전화번호로 걸어 실제 대화를 합니다. 대화 내용을 실시간으로 보고 언제든 끊을 수 있습니다.",
"faq.2q":"통화하는 AI는 무엇인가요?","faq.2a":"대화, 중간 질문, 요약은 Meta의 Muse Spark 모델이 Meta Model API를 통해 수행합니다. 음성 인식과 전화선은 Vapi를 씁니다.",
"faq.3q":"AI가 저한테 안 묻고 합의해 버리지 않나요?","faq.3a":"아니요. 부탁에 없던 것(새 시간, 요금, 계획 변경)은 모두 화면에 한국어 질문으로 올라옵니다. 답하실 때까지 AI가 통화를 유지합니다.",
"faq.4q":"다른 AI 에이전트도 쓸 수 있나요?","faq.4a":"네, MCP 커넥터로 가능합니다. 에이전트가 당신 대신 전화를 걸 수도, 당신에게 전화를 걸 수도 있습니다 — 예를 들어 일정을 읽어 주는 아침 모닝콜처럼요.",
"faq.5q":"하지 않는 일은요?","faq.5a":"응급 전화(911), 의료·법률 판단, 법적 효력이 있는 본인 사칭은 하지 않습니다. 통화는 요약을 위해 녹음되며, 상대가 물으면 어시스턴트임을 밝힙니다.",
"cta.sub":"더 연결된 세상은 대화 한 통에서 시작합니다.","cta.btn":"전화 걸기 ↗",
"foot.r":"Meta Muse Spark · Muse Voice로 만들었습니다 · Meta Model API · 뉴저지 크레스킬"
};
var EN={};
document.querySelectorAll('[data-i18n],[data-i18n-html],[data-i18n-ph]').forEach(function(el){
  var k=el.getAttribute('data-i18n')||el.getAttribute('data-i18n-html')||el.getAttribute('data-i18n-ph');
  EN[k]=el.hasAttribute('data-i18n-html')?el.innerHTML:el.hasAttribute('data-i18n-ph')?el.getAttribute('placeholder'):el.textContent;
});
function apply(lang){
  var D=lang==='ko'?KO:EN;
  document.querySelectorAll('[data-i18n]').forEach(function(el){var k=el.getAttribute('data-i18n');if(D[k]!=null)el.textContent=D[k];});
  document.querySelectorAll('[data-i18n-html]').forEach(function(el){var k=el.getAttribute('data-i18n-html');if(D[k]!=null)el.innerHTML=D[k];});
  document.querySelectorAll('[data-i18n-ph]').forEach(function(el){var k=el.getAttribute('data-i18n-ph');if(D[k]!=null)el.setAttribute('placeholder',D[k]);});
  document.querySelectorAll('#lang [data-lang]').forEach(function(s){s.classList.toggle('on',s.getAttribute('data-lang')===lang);});
  document.documentElement.lang=lang;
  var sel=document.getElementById('language'); if(sel&&!sel.dataset.touched) sel.value=lang;
  try{localStorage.setItem('msc_lang',lang);}catch(e){}
}
var saved=null; try{saved=localStorage.getItem('msc_lang');}catch(e){}
var initial=saved||((navigator.language||'').toLowerCase().indexOf('ko')===0?'ko':'en');
apply(initial);
document.getElementById('lang').addEventListener('click',function(){apply(document.documentElement.lang==='ko'?'en':'ko');});
var sel=document.getElementById('language'); sel.addEventListener('change',function(){sel.dataset.touched='1';});

var menu=document.getElementById('menu'),links=document.getElementById('links');
menu.addEventListener('click',function(){var open=links.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'✕':'☰';});
links.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){links.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰';});});

// Hand the draft to the real app (sessionStorage, nothing in the URL).
document.getElementById('simulate').addEventListener('click',function(){
  var req=document.getElementById('request').value.trim();
  if(!req){document.getElementById('request').focus();return;}
  try{sessionStorage.setItem('msc_draft',JSON.stringify({lang:sel.value,topic:document.getElementById('topic').value,briefing:req,at:Date.now()}));}catch(e){}
  window.location.href='/app/new';
});

document.getElementById('copy').addEventListener('click',function(){
  var value=document.getElementById('code').textContent;
  navigator.clipboard.writeText(value).then(function(){showToast('Copied');},function(){showToast('Select and copy the code');});
});
function showToast(s){var t=document.getElementById('toast');t.textContent=s;t.classList.add('show');setTimeout(function(){t.classList.remove('show');},2300);}
})();

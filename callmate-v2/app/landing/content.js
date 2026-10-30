// Generated from landing-body.html / landing-script.js / landing.css — edit those, then run: node scripts/build-landing.mjs
export const LANDING_CSS = `
:root{--paper:#F7F2E8;--ink:#1E1915;--red:#E2603F;--pencil:#9A9088;--rule:#DED5C6}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
.msc-landing{min-height:100vh;background:var(--paper);color:var(--ink);font-family:Fredoka,"Pretendard",system-ui,sans-serif;font-weight:400;line-height:1.35;display:flex;flex-direction:column}
.msc-landing a{color:inherit;text-decoration:none}
.msc-landing button{font:inherit;cursor:pointer;background:none;border:0;color:inherit}

/* nav: two things only */
.nav{padding:18px 28px}
.navin{display:flex;align-items:center;justify-content:space-between;max-width:1120px;margin:auto}
.brand{display:flex;align-items:center;gap:10px;font-weight:600;font-size:20px}
.brand b{color:var(--red);font-weight:600}
.navr{display:flex;align-items:center;gap:8px}
.lang,.help{border:2px solid var(--ink);border-radius:999px;padding:7px 14px;font-weight:500;font-size:14px;background:var(--paper)}
.lang span{color:var(--pencil)}.lang span.on{color:var(--ink)}.lang span+span::before{content:" / ";color:var(--pencil)}
.msc-landing button.help{background:var(--ink);color:var(--paper)}
.lang:focus-visible,.help:focus-visible,.dial:focus-visible,.q:focus-visible,.pill:focus-visible,.close:focus-visible{outline:3px solid var(--red);outline-offset:3px}

main{flex:1;max-width:1120px;width:100%;margin:auto;padding:0 28px}

/* hero: the drawing and one button */
.hero{display:grid;grid-template-columns:1.05fr 1fr;align-items:center;gap:24px;min-height:min(72vh,640px);padding:24px 0 8px}
.mascot{width:100%;max-width:560px;height:auto;display:block;justify-self:center}
.say{display:flex;flex-direction:column;align-items:flex-start;gap:26px}
.hero h1{font-size:clamp(44px,6.2vw,88px);line-height:.98;letter-spacing:-.02em;font-weight:600;margin:0}
.dial{display:inline-flex;align-items:center;gap:14px;background:var(--red);color:#fff;border-radius:999px;padding:20px 34px 20px 26px;font-size:clamp(22px,2.4vw,30px);font-weight:600;line-height:1;transition:transform .15s;box-shadow:0 0 0 3px var(--paper),0 0 0 6px var(--ink)}
.dial svg{width:1.05em;height:1.05em;fill:#fff}
.dial:hover{transform:translateY(-2px) rotate(-1.5deg)}
.dial.small{font-size:18px;padding:14px 24px 14px 20px;margin-top:28px}
.whisper{margin:0;color:var(--pencil);font-size:17px}

/* quick actions: four doodles on a line, no boxes */
.quick{display:flex;justify-content:space-between;gap:16px;padding:42px 0 10px;border-top:2px dashed var(--rule);margin-top:24px}
.q{display:flex;flex-direction:column;align-items:center;gap:10px;flex:1;color:var(--ink);font-weight:500;font-size:17px;text-align:center;padding:10px 6px;border-radius:18px;transition:transform .15s}
.q svg{width:78px;height:78px;color:var(--ink)}
.q:hover{transform:translateY(-3px) rotate(-2deg)}
.q:hover svg{color:var(--red)}

/* agents */
.agents{display:flex;justify-content:center;gap:14px;flex-wrap:wrap;padding:40px 0 56px}
.msc-landing a.pill{border:2px solid var(--ink);border-radius:999px;padding:13px 22px;font-weight:500;font-size:17px;background:var(--ink);color:var(--paper)}
.msc-landing a.pill.ghost{background:transparent;color:var(--ink)}
.msc-landing a.dial{color:#fff}
.pill:hover{transform:translateY(-2px)}

footer{max-width:1120px;width:100%;margin:auto;padding:18px 28px 28px;display:flex;gap:18px;flex-wrap:wrap;color:var(--pencil);font-size:13px;border-top:2px dashed var(--rule)}
footer a:hover{color:var(--ink)}

/* the explainer sheet */
.sheet{position:fixed;inset:0;background:rgba(30,25,21,.35);display:flex;align-items:flex-end;justify-content:center;z-index:50;padding:0}
.sheet[hidden]{display:none}
.sheetin{position:relative;width:min(720px,100%);max-height:88vh;overflow:auto;background:var(--paper);border:3px solid var(--ink);border-bottom:0;border-radius:28px 28px 0 0;padding:34px 34px 40px}
.close{position:absolute;right:16px;top:14px;width:38px;height:38px;border-radius:50%;border:2px solid var(--ink);font-size:16px;background:var(--paper)}
.sheet h2{font-size:30px;font-weight:600;margin:0 0 20px;line-height:1.1}
.sheet dl{margin:0;display:grid;gap:18px}
.sheet dt{font-weight:600;font-size:18px;margin:0 0 4px}
.sheet dd{margin:0;color:#4b443e;font-size:16px;max-width:58ch}
@media(min-width:720px){.sheet{align-items:center;padding:24px}.sheetin{border-bottom:3px solid var(--ink);border-radius:28px}}

@media(max-width:820px){
  .nav{padding:14px 18px}.brand{font-size:18px}
  main{padding:0 18px}
  .hero{grid-template-columns:1fr;text-align:center;min-height:0;padding-top:4px;gap:10px}
  .mascot{max-width:340px}
  .say{align-items:center;gap:20px}
  .hero h1{font-size:clamp(38px,11vw,54px)}
  .dial{font-size:22px;padding:18px 28px 18px 22px}
  .quick{flex-wrap:wrap;gap:6px 0;padding-top:28px}
  .q{flex:0 0 50%;font-size:15px}.q svg{width:64px;height:64px}
  .agents{padding:28px 0 40px}
  footer{padding:16px 18px 24px}
}
@media(prefers-reduced-motion:reduce){.dial,.q,.pill{transition:none}.dial:hover,.q:hover,.pill:hover{transform:none}}

`;

export const LANDING_HTML = `<div class="msc-landing" id="top">
<header class="nav"><div class="navin"><a href="/" class="brand" aria-label="My Side Call home"><span>My Side <b>Call</b></span></a><div class="navr"><button class="lang" id="lang" type="button" aria-label="Switch language"><span data-lang="en">EN</span><span data-lang="ko">한국어</span></button><button class="help" id="help" type="button" aria-haspopup="dialog" aria-controls="sheet" data-i18n="nav.help">What is this?</button></div></div></header>

<main>
<section class="hero">
  <img class="mascot" src="/brand/mascot.png" alt="A scribble character talking on a red phone">
  <div class="say">
    <h1 data-i18n-html="hero.h1">Your AI<br>makes the call.</h1>
    <a class="dial" href="/app/new"><svg viewBox="0 0 24 24" aria-hidden><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg><span data-i18n="hero.cta">Make a call</span></a>
    <p class="whisper" data-i18n="hero.whisper">Ask in your language. We talk in theirs.</p>
  </div>
</section>

<section class="quick" aria-label="Common calls">
  <a href="/app/new?template=Restaurant%20reservation" class="q"><svg viewBox="0 0 48 48"><use href="#i-plate"/></svg><span data-i18n="q.1">Book a table</span></a>
  <a href="/app/new?template=Internet%20%2F%20cable%20support" class="q"><svg viewBox="0 0 48 48"><use href="#i-router"/></svg><span data-i18n="q.2">Customer service</span></a>
  <a href="/app/new?template=Landlord%20%2F%20building%20office" class="q"><svg viewBox="0 0 48 48"><use href="#i-house"/></svg><span data-i18n="q.3">Landlord</span></a>
  <a href="/app/new?template=Airline%20%2F%20hotel" class="q"><svg viewBox="0 0 48 48"><use href="#i-plane"/></svg><span data-i18n="q.4">Travel</span></a>
</section>

<section class="agents">
  <a class="pill" href="/app/muse" data-i18n="a.muse">Ask Muse to call</a>
  <a class="pill ghost" href="/app/agents" data-i18n="a.mcp">Connect your own agent</a>
</section>
</main>

<footer><span>© 2026 HARUDAOL LLC</span><span data-i18n="foot.meta">Built on Meta Muse Spark &amp; Muse Voice</span><a href="/privacy" data-i18n="foot.privacy">Privacy</a><a href="/terms" data-i18n="foot.terms">Terms</a></footer>

<!-- Everything explanatory lives here, behind the "?" -->
<div class="sheet" id="sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-h" hidden>
  <div class="sheetin">
    <button class="close" id="close" type="button" aria-label="Close">✕</button>
    <h2 id="sheet-h" data-i18n="s.h">What My Side Call does</h2>
    <dl>
      <dt data-i18n="s.1t">You write what you need</dt><dd data-i18n="s.1d">In Korean, Spanish, Japanese, Chinese or English. Snap a photo of a bill and it reads the account number and amount for you.</dd>
      <dt data-i18n="s.2t">The AI makes a real phone call</dt><dd data-i18n="s.2d">In natural English, to any US number. It says it is an AI assistant in its first sentence and that the call may be recorded.</dd>
      <dt data-i18n="s.3t">It asks you before deciding</dt><dd data-i18n="s.3d">A new time, an extra fee — anything not in your request comes to your screen as a question in your language. The AI keeps the line open until you answer.</dd>
      <dt data-i18n="s.4t">You get a summary in your language</dt><dd data-i18n="s.4d">What was agreed, what is still open, what to put on your calendar — plus the recording and a clean transcript.</dd>
      <dt data-i18n="s.5t">Your other AI can use it too</dt><dd data-i18n="s.5d">Muse, Claude or any agent can connect and place calls for you, or call you — a wake-up call, a reminder, a result.</dd>
      <dt data-i18n="s.6t">Built with Meta</dt><dd data-i18n="s.6d">Muse Spark runs the conversation, the summary and the bill reading. Muse Voice Transcribe re-transcribes the recording. Facebook Login signs you in.</dd>
      <dt data-i18n="s.7t">What it will not do</dt><dd data-i18n="s.7d">Emergency calls (911), medical or legal judgment calls, or agreeing to anything you did not approve.</dd>
      <dt data-i18n="s.8t">Where this goes</dt><dd data-i18n="s.8d">Today: your language to English, in the US. Next: English to any language, in any country. Later: two people, two languages, one live call.</dd>
    </dl>
    <a class="dial small" href="/app/new"><span data-i18n="hero.cta">Make a call</span></a>
  </div>
</div>

<svg width="0" height="0" style="position:absolute" aria-hidden>
  <defs>
    <g id="i-plate" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 25.6c-.3-6 4.9-11 10.6-10.9 5.9.1 10.7 5 10.3 11-.4 5.9-5.3 9.8-11 9.6-5.6-.2-9.7-4-9.9-9.7z"/><path stroke-width="2.2" d="M20.4 24.2v1.2M27.8 24.2v1.2"/><path stroke-width="2" d="M21.4 27.8c2.5 1.4 4.9 1.4 5.4 0"/><path stroke="#E2603F" d="M7 16v17M4.6 16v4.8c0 1.7 1 2.7 2.4 2.7s2.4-1 2.4-2.7V16"/><path d="M41 16c2.2 2.8 2.2 6.6 0 9v8"/></g>
    <g id="i-router" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 29.4c-.2-2.1 1.2-3.5 3.3-3.6l25.6-.2c2.1 0 3.4 1.3 3.4 3.3v5.3c0 2-1.3 3.3-3.3 3.3H11.4c-2.1 0-3.3-1.3-3.4-3.2z"/><path stroke-width="2.2" d="M16.5 30.8v1.2M22.5 30.8v1.2"/><path stroke-width="2" d="M17.5 34.4c1.8 1.4 4.2 1.4 4 0"/><circle cx="32.5" cy="32.7" r="1.4" fill="#E2603F" stroke="none"/><circle cx="36.8" cy="32.7" r="1.4" fill="#E2603F" stroke="none"/><path d="M36 25.5v-7"/><circle cx="36" cy="16" r="2.1" fill="#E2603F" stroke="none"/><path stroke="#E2603F" stroke-width="2.4" d="M16 17.6c4.4-4 11.6-4 16 0M19.8 13.4c2.3-2 6.1-2 8.4 0"/></g>
    <g id="i-house" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 23.5 23.4 9.9c.4-.3.9-.3 1.2 0L39.5 23.3"/><path d="M13 20.5v16.4c0 1.5 1 2.5 2.5 2.5h17c1.5 0 2.5-1 2.5-2.5V20.7"/><path stroke="#E2603F" d="M20.6 39.4v-8.2c0-1.4.9-2.3 2.3-2.3h2.2c1.4 0 2.3.9 2.3 2.3v8.2"/><path stroke-width="2.2" d="M19.6 23.8v1.2M28.4 23.8v1.2"/><path stroke-width="2" d="M20.6 27.4c3.2 1.4 6.8 1.4 6.8 0"/><path stroke="#E2603F" stroke-width="2.4" d="M38.8 27.8c-1 1.4-1 2.8 0 3.5 1-.7 1-2.1 0-3.5z"/></g>
    <g id="i-plane" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 22.8 38.2 11.2c.8-.3 1.5.4 1.2 1.2L28.9 36.8c-.3.7-1.3.8-1.7.1l-5.4-8.7-11.6-3.6c-.9-.3-.9-1.4-.7-1.8z"/><path stroke-width="2.2" d="M21.8 28.2 38.6 12.1"/><path stroke-width="2.2" d="M21.8 28.2l-1.1 7 4.2-4.9"/><path stroke-width="2.2" d="M27.8 19.4v1.2M33.2 19.4v1.2"/><path stroke-width="2" d="M28.8 23c1.5 1.4 3.9 1.4 3.4 0"/><path stroke="#E2603F" stroke-width="2.4" d="M5.5 31.5h6.5M7.5 36.5h4.5"/></g>
  </defs>
</svg>
</div>
`;

export const LANDING_JS = `(function(){
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
`;

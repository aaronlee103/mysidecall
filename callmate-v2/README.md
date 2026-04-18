# My Side Call 웹 (랜딩 + MVP 앱)

재미 한인을 위한 영어 전화 대행 AI. 이 저장소 한 곳에 **랜딩페이지**와 **실제 웹 앱 MVP**가 함께 있습니다.

| 경로 | 역할 |
|---|---|
| `/` | 대기자 수집 랜딩페이지 |
| `/app` | 대시보드 (새 통화 시작) |
| `/app/new` | 통화 브리핑 폼 |
| `/app/call/[id]` | 실시간 통화 화면 (상태 + 개입) |
| `/app/summary/[id]` | 통화 후 요약 |

배포 한 번에 두 가지가 다 올라갑니다.

---

## 빠른 시작 (비개발자용 배포 가이드)

### 1단계. GitHub 레포지토리 만들기 (5분)

1. [github.com](https://github.com) 로그인 → 우상단 **+** → **New repository**
2. Repository name: `mysidecall` (원하는 이름)
3. **Private** 선택
4. 이 폴더의 모든 파일을 업로드 (Upload files 버튼 or 드래그)
5. 커밋 메시지: `v0.1 랜딩 + 웹 MVP`

### 2단계. Tally 대기자 폼 만들기 (3분) — 랜딩용

1. [tally.so](https://tally.so) 가입
2. **Create form** → Start from scratch
3. 이메일 필드 1개 (required), 제목 "베타 출시되면 알려드릴게요"
4. URL에서 폼 ID 복사 (예: `tally.so/r/abc123` → `abc123`)

### 3단계. Vapi 에이전트 준비 (앞서 완료됐다면 스킵)

[`vapi-agent/setup-guide-KO.md`](../vapi-agent/setup-guide-KO.md) 참고.
이 단계가 끝나면 아래 값 3개를 얻습니다:

- `VAPI_PRIVATE_KEY` — Vapi 대시보드의 Private Key
- `VAPI_PHONE_NUMBER_ID` — Vapi에 등록된 Twilio 번호 ID
- `VAPI_ASSISTANT_ID` — 생성한 에이전트 ID

### 4단계. Vercel에 배포 (5분)

1. [vercel.com](https://vercel.com) → New Project → GitHub 레포 연결
2. **Framework Preset**: Next.js (자동 감지)
3. **Environment Variables** 섹션에 아래 4개 입력:

| 이름 | 값 |
|---|---|
| `NEXT_PUBLIC_TALLY_FORM_ID` | 2단계 폼 ID |
| `VAPI_PRIVATE_KEY` | Vapi Private Key |
| `VAPI_PHONE_NUMBER_ID` | Vapi 전화번호 ID |
| `VAPI_ASSISTANT_ID` | Vapi 에이전트 ID |

4. **Deploy** → 2~3분 후 URL 확인
   - 랜딩: `https://callmate.vercel.app/`
   - 앱: `https://callmate.vercel.app/app`

### 5단계. 본인 휴대폰으로 첫 통화 테스트

1. 배포된 URL에서 `/app`으로 이동
2. "새 통화 시작" → 본인 이름·브리핑·**본인 휴대폰 번호** 입력
3. 동의 체크 → "AI 전화 시작"
4. 본인 휴대폰으로 전화 옴 → "식당 직원" 역할 연기
5. 웹 화면에서 실시간 transcript·개입 UI 확인
6. 통화 종료 후 요약 페이지 자동 이동

### 6단계. 커스텀 도메인 (선택, 10분)

Vercel → Settings → Domains → 도메인 추가 → DNS 레코드 복사해서 도메인 관리자에 입력.

---

## 기술 스택

- **Next.js 14** App Router (JS)
- **Tailwind CSS 3.4** + Pretendard 한국어 폰트
- **Tally** 대기자 수집 (랜딩)
- **Vapi REST API** 아웃바운드 전화 (서버사이드 fetch)

의존성 없음 (Vapi 용 별도 SDK 없이 fetch로 처리).

---

## 파일 구조

```
landing-page/
├── app/
│   ├── layout.jsx              # 공통 메타데이터
│   ├── page.jsx                # 랜딩페이지
│   ├── globals.css             # Tailwind + Pretendard
│   ├── app/                    # ⭐ 웹 앱 (보호 구역)
│   │   ├── layout.jsx          # 앱 네비게이션 바
│   │   ├── page.jsx            # 대시보드
│   │   ├── new/
│   │   │   └── page.jsx        # 브리핑 폼
│   │   ├── call/[callId]/
│   │   │   └── page.jsx        # 실시간 통화 화면
│   │   └── summary/[callId]/
│   │       └── page.jsx        # 통화 요약
│   └── api/
│       └── calls/
│           ├── route.js        # POST - 통화 시작
│           └── [callId]/
│               ├── route.js    # GET - 통화 조회
│               ├── message/
│               │   └── route.js  # POST - 사용자 개입
│               └── end/
│                   └── route.js  # POST - 통화 종료
├── lib/
│   └── vapi.js                 # Vapi API 래퍼
├── package.json
├── tailwind.config.js
├── next.config.mjs
├── postcss.config.mjs
├── jsconfig.json
├── .env.example
└── .gitignore
```

---

## 주요 흐름

```
[1] 사용자 /app/new에서 브리핑+번호 입력 + 동의 체크
         ↓
[2] POST /api/calls → Vapi API 호출 → 통화 시작
         ↓
[3] 사용자 /app/call/[id]로 리다이렉트
         ↓
[4] 2초마다 GET /api/calls/[id] 폴링 → transcript 업데이트
         ↓ (사용자 개입 시)
[5] POST /api/calls/[id]/message → Vapi 컨트롤 API로 메시지 주입
         ↓
[6] AI가 개입 정보를 자연스럽게 영어로 반영
         ↓
[7] 통화 종료 감지 → /app/summary/[id]로 자동 이동
         ↓
[8] 요약·전체 스크립트·녹음 링크 표시
```

---

## 제한사항 (Week 1 MVP)

- 로그인 없음 (누구나 `/app` 접근 가능) — Phase 1에 Clerk 추가 예정
- 통화 기록 DB 저장 없음 — Phase 1에 Supabase 추가 예정
- 카메라 OCR 아직 UI만, 미구현 — Phase 1에 추가 예정
- 한국어 요약 번역 아직 미구현 — Vapi 요약이 영어로 뜸
- 결제 없음 — 베타 기간 무료

이 MVP는 **수요 검증용**이에요. 인터뷰이에게 데모할 용도입니다.

---

## 시드 문구 (랜딩 공유할 때)

> 안녕하세요. 미국 생활하면서 영어 전화가 제일 부담스럽더라고요.
> 그래서 AI가 대신 전화 걸어주는 앱을 만들고 있어요.
> 한국어로 상황 설명하면 AI가 영어로 대신 전화하고 결과를 한국어로 알려주는 방식입니다.
>
> 베타 테스터 모집 중이에요. 무료로 5번 써보실 수 있고 30분 피드백 주시면 스타벅스 $15 기프트 드립니다.
> 관심 있으시면 여기 이메일 남겨주세요 → [Vercel URL]
>
> 궁금한 점은 댓글로 남겨주세요!

---

## 다음 단계 체크리스트

**Day 1~2 (배포)**
- [ ] GitHub 레포 생성 + 이 폴더 업로드
- [ ] Tally 폼 생성
- [ ] Vapi 에이전트 생성 (vapi-agent 가이드 참고)
- [ ] Vercel 환경변수 4개 설정 + Deploy
- [ ] 본인 휴대폰으로 첫 테스트 통화

**Day 3~4 (데모·피드백)**
- [ ] 3가지 시나리오로 테스트 녹음 (식당·Comcast·집주인)
- [ ] Cowork에 녹음 올려 프롬프트 튜닝 요청
- [ ] 데모 영상 1개 편집 → 랜딩 데모 섹션 업데이트 요청

**Day 5~7 (시드)**
- [ ] 랜딩 URL을 3곳에 공유 (MissyUSA, KakaoTalk 오픈채팅, r/Korean)
- [ ] 인터뷰 10~15명 예약
- [ ] 베타 초대 이메일 준비 (`/app` URL 포함)

---

## Cowork에게 도움 요청할 때

다음처럼 말씀하세요:

- "Vercel 배포 에러" + 스크린샷 → 진단·수정
- "카피 수정해줘: hero 문구를 X로" → 코드 수정 PR diff
- "AI 음성이 부자연스러워. 녹음 올림" → 시스템 프롬프트 튜닝
- "대시보드에 통화 횟수 카운터 추가해줘" → UI 컴포넌트 추가

---

*© 2026 My Side Call. Built with Cowork.*

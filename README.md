# AWS Service Quiz

AWS 서비스 아이콘을 보고 어떤 서비스인지 맞추는 4지선다 퀴즈 웹앱.

**Live:** https://aws-service-quiz-fawn.vercel.app

## Features

- **100개 AWS 서비스** — 5단계 난이도로 분류
- **15문제 랜덤 출제** — 난이도 균형 배분 (Easy 3 / Medium 5 / Hard 5 / Expert 2)
- **타이머 기반 경쟁** — 빠르게 맞출수록 높은 순위
- **오답 패널티 +10초** — 틀리면 최종 시간에 10초 가산
- **일일 3회 제한** — KST 기준 자정 리셋
- **리더보드** — 최고 기록 기준 전체 순위 (로그인 없이 열람 가능)
- **Google 로그인** — OAuth 2.0, 닉네임 설정 필수

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth & DB | Supabase (PostgreSQL, RLS, Google OAuth) |
| Icons | [aws-icons](https://www.npmjs.com/package/aws-icons) via jsDelivr CDN |
| Deploy | Vercel |

## Architecture

```
app/
├── page.tsx              # Landing (Google login)
├── setup/page.tsx        # Nickname setup
├── play/
│   ├── page.tsx          # Play menu (server component)
│   ├── play-client.tsx   # Play menu UI (client component)
│   ├── game/page.tsx     # Quiz gameplay
│   └── result/page.tsx   # Result display
├── leaderboard/page.tsx  # Public leaderboard
├── auth/callback/        # OAuth callback
└── actions/
    ├── game.ts           # startGame, completeGame, getDailyAttempts, getMyRecords
    └── auth.ts           # setNickname, signOut
```

- **Server Actions** — 게임 시작/종료, 닉네임 설정 등 mutation 처리
- **Admin Client** — 리더보드 조회 등 RLS 우회가 필요한 서버 전용 작업
- **Middleware** — 인증 가드, 프로필 미설정 시 `/setup` 리다이렉트

## Database Schema

```sql
profiles        -- id (auth.users FK), nickname (unique), avatar_url
game_sessions   -- id, user_id, started_at, completed_at, total_time_ms,
                -- penalty_ms, final_time_ms, penalty_count, correct_count,
                -- questions (jsonb), status ('playing'|'completed'|'abandoned')
leaderboard     -- VIEW: best final_time per user, RANK()
```

- **RLS** — 모든 테이블에 Row Level Security 적용
- **DB Trigger** — `check_daily_limit()`: 일일 3회 제한 서버사이드 강제
- **Grants** — anon: SELECT only / authenticated: SELECT, INSERT, UPDATE only

## Security

- CSP, HSTS, X-Frame-Options, Permissions-Policy 등 보안 헤더 적용
- Server Action 입력값 검증 (answers 배열 길이/타입, 닉네임 패턴)
- Supabase Service Role Key는 서버 전용, 클라이언트 노출 없음
- Email 인증 비활성화 — Google OAuth만 허용

## Getting Started

```bash
# Install
npm install

# Set environment variables
cp .env.local.example .env.local
# Fill in: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

# Dev
npm run dev

# Build
npm run build
```

## License

Private

# 🤖 1lev_up 에이전트 개발 지침 및 종합 제품 헌장 (agent.md)

> 본 문서는 **1lev_up (하루 1레벨 업 최소 습관 & 루틴 시스템)** 프로젝트의 제품 철학, 시스템 아키텍처, 데이터베이스 스키마, 온보딩/인증 플로우 및 AI 에이전트의 개발 원칙을 정의한 최상위 기준 문서입니다.  
> 모든 기능 추가 및 리팩토링은 본 문서의 원칙과 사양을 반드시 준수해야 합니다.

---

## 1. 프로젝트 비전 및 핵심 철학 (Vision & Philosophy)

### "의지력에 기대지 마세요. 시스템이 당신을 자동으로 데려다줍니다."
- **문제 인식**: 대부분의 사람들은 의지력으로 자기계발을 시도하다가 바쁘거나 지친 날 실패를 경험하고, 자책감으로 루틴 전체를 포기합니다.
- **해결책**:
  1. **최소 실행 가능 루틴 (Minimum Viable Routine)**: 지치고 힘든 날에도 무너지지 않는 '최소한의 기준'만 세팅합니다.
  2. **The ONE Thing**: 하루에 수십 가지 목표를 세우지 않고, 오늘 나를 가장 크게 성장시킬 '단 하나의 과업'에 집중합니다.
  3. **의사결정 피로(Decision Fatigue) 제로**: 전날 밤 미리 내일의 One Thing을 적어두고, 아침에는 생각할 필요 없이 바로 행동으로 연결합니다.
  4. **인지적 저항을 낮추는 대체 장치(Fallback)**: 오늘 원씽이 마땅치 않거나 지쳤을 땐 클릭 한 번으로 '독서 15분'으로 대체합니다.

---

## 2. 제품 핵심 기능 사양 (Core Features)

### 2.1. 오늘의 The ONE Thing (대시보드 상단 최우선 카드)
- **전날 밤 기록 자동 연동**: 어젯밤 메모한 `nextOneThing`이 오늘 아침 메인 카드에 자동 노출.
- **독서 15분 대체 토글**: 원씽이 없거나 지친 날 "📖 독서 15분 몰입"으로 원클릭 전환.
- **달성 피드백**: 완료 체크 시 Canvas Confetti 애니메이션 및 완료 시각 기록.

### 2.2. 일상 최소 루틴 타임라인
- **기본 추천 6가지 루틴**:
  1. `07:00 AM` ☀️ 아침 7시 기상
  2. `기상 직후` 🚶 아침 15분 산책
  3. `오전` 🎯 가장 중요한 일 1가지 수행 (없을 시 독서 15분)
  4. `점심 식후` 🥗 점심 15분 산책
  5. `퇴근 후` 💻 퇴근 후 자기계발 1시간 (60분 몰입 전용 타이머 탑재)
  6. `취침 전` 🌙 오늘 하루 및 독서 기록 + 내일 One Thing 메모
- **자유로운 관리**: 인라인 수정(✏️), 순서 변경(▲▼), 삭제(🗑️), 커스텀 루틴 추가(+) 지원.

### 2.3. 오늘 하루 및 독서 기록 (Record & Review)
- **독서 노트**: 읽은 책 제목, 분량(페이지/시간), 마음에 남은 핵심 문장 및 나의 생각.
- **하루 회고**: 기분 상태(최고/만족/보통/피곤) 및 짧은 일기(1~3문장).
- **내일의 One Thing 정하기**: 취침 전 기록 ➔ 다음 날 화면에 자동 배정.

### 2.4. 독서 서재(Books Archive) & 캘린더 통계(Stats)
- **독서 서재**: 기록한 책들과 인사이트 문장들을 카드 형태로 모아보고 실시간 검색.
- **스트릭(Streak) & 캘린더**: 연속 달성 일수 불꽃 배지 및 월간 달성 현황 뷰.

### 2.5. 온보딩 팝업 (Onboarding Modal)
- 신규 방문 시 추천 6가지 루틴 예시를 소개하고, **[이 예시 그대로 내 루틴으로 사용하기]** 원클릭 지원.
- 상단 헤더의 `💡 추천 예시` 버튼으로 언제든 재열람 가능.

---

## 3. 사용자 경험(UX) 및 인증/동기화 전략

### 3.1. 게스트 우선 진입 (Zero Friction)
- 회원가입 없이 브라우저 `LocalStorage`를 통해 즉시 서비스 100% 이용 가능.
- 사용자가 데이터 영구 보존 및 기기 간 동기화를 원할 때 로그인 유도.

### 3.2. 소셜 로그인
- **수단**: Google / Kakao 간편 로그인 (Supabase Auth).

### 3.3. 스마트 데이터 병합 (Smart Migration Policy)
- **신규 가입 시**: 브라우저에 저장되어 있던 기존 로컬 루틴/기록 데이터를 계정 클라우드로 자동 복사(Upload).
- **기존 계정 로그인 시**: 로컬의 최근 데이터와 클라우드 데이터를 날짜 기준으로 안전하게 병합.

---

## 4. 시스템 아키텍처 및 데이터베이스 스키마

### 4.1. 기술 스택
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Canvas Confetti
- **State Management**: Zustand 또는 React Context API (경량 로컬/클라우드 하이브리드 스토어)
- **Backend / Database**: Supabase (PostgreSQL, Supabase Auth, Row Level Security)
- **Deployment**: Vercel (GitHub CI/CD 자동 배포), PWA

### 4.2. Supabase DB 스키마 (PostgreSQL)

```sql
-- 1. 사용자 프로필 테이블
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  nickname text,
  current_streak int default 0,
  best_streak int default 0,
  has_completed_onboarding boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. 사용자별 루틴 설정 테이블
create table public.routines (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  time_hint text not null,
  category text not null check (category in ('morning', 'lunch', 'evening', 'night')),
  description text default '',
  type text default 'standard' check (type in ('standard', 'one-thing', 'timer', 'record')),
  fallback_text text,
  order_index int default 0,
  is_custom boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. 일별 루틴 및 기록 로그 테이블
create table public.daily_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  routines jsonb default '{}'::jsonb not null,
  one_thing jsonb default '{"title":"","isFallback":false,"completed":false}'::jsonb not null,
  next_one_thing text default '',
  reading jsonb default '{"bookTitle":"","pages":"","keyInsight":""}'::jsonb not null,
  review jsonb default '{"content":"","mood":"good"}'::jsonb not null,
  study_timer_minutes int default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, date)
);

-- RLS (Row Level Security) 설정: 오직 본인 데이터만 CRUD 가능
alter table public.profiles enable row level security;
alter table public.routines enable row level security;
alter table public.daily_logs enable row level security;

create policy "Users can manage own profile" on public.profiles for all using (auth.uid() = id);
create policy "Users can manage own routines" on public.routines for all using (auth.uid() = user_id);
create policy "Users can manage own daily_logs" on public.daily_logs for all using (auth.uid() = user_id);
```

---

## 5. AI 에이전트 개발 및 코딩 원칙 (Engineering Principles)

1. **오프라인 우선 (Offline-First)**:
   - 네트워크 연결이 불안정하거나 비로그인 상태에서도 UI가 깨지지 않고 로컬스토리지에 항상 즉시 저장되어야 합니다.
2. **타입 안전성 (Strict Type-Safety)**:
   - TypeScript `any` 타입을 엄격히 지양하고, Supabase Generated Types 또는 공유 모델 인터페이스를 사용합니다.
3. **모바일 퍼스트 반응형 (Mobile-First UI)**:
   - 모든 화면 컴포넌트는 스마트폰 화면(360px ~ 430px)을 기본으로 설계하며, 태블릿/PC(최대 768px 너비의 중앙 정렬 카드형 레이아웃)로 자연스럽게 확장되어야 합니다.
4. **미니멀 & 정갈한 인터페이스**:
   - 불필요하게 복잡한 대시보드 대신, 한 화면에서 오늘의 할 일과 회고가 직관적으로 연결되는 따뜻하고 모던한 UI를 유지합니다.
5. **기존 코드 보존 원칙 (Code Preservation Rules)**:
   - 이미 정상 동작하는 비즈니스 로직, 컴포넌트 구조, 주석, 기존 텍스트 문구를 사용자의 명시적 지시 없이 임의로 삭제하거나 전면 재작성하지 않습니다.
   - 기존 구현의 의도와 맥락을 최대한 존중하며, 점진적(Incremental)으로 코드를 추가/확장합니다.
6. **최소 코드 수정 원칙 (Minimal Diff Principle)**:
   - 목표한 요구사항을 만족하는 '가장 정밀하고 최소한의 변경 범위(Surgical Edit)'를 적용합니다.
   - 하나의 기능 추가를 위해 무관한 파일 포맷팅 변경이나 불필요한 전면 리팩토링을 절대 금지합니다.

---

## 6. 변경사항 설명 표준 보고 포맷 (Change Explanation Format)

에이전트가 코드 수정 또는 기능 구현을 완료한 후, 사용자에게 결과를 전달할 때는 반드시 아래의 **3단계 표준 포맷**을 준수하여 보고합니다:

```markdown
### 📌 [태그] 변경 작업 요약 제목 (예: [feat], [fix], [refactor])

1. **변경 목적 (Why)**:
   - 이번 수정이 필요한 이유 및 달성하고자 한 핵심 요구사항 설명

2. **주요 변경 파일 및 최소 수정 내역 (What)**:
   - `[파일명](file:///절대경로)`: 기존 코드를 보존하며 최소한으로 추가/수정한 구체적 내용 기술

3. **영향도 및 검증 결과 (Verification)**:
   - 기존 기능의 정상 동작 여부 (하위 호환성 및 사이드 이펙트 점검)
   - 빌드 검증 (`npm run build`) 및 브라우저 런타임 테스트 완료 여부
```

---

## 7. 단계별 출시 로드맵 (Roadmap)

### Phase 1: 클라우드 연동 및 상용 웹 런칭 (현재 마일스톤)
- [x] 프론트엔드 핵심 루틴, 원씽, 독서 서재, 온보딩 구현 완료
- [ ] Supabase 프로젝트 연동 & DB 스키마 세팅
- [ ] Google / Kakao 소셜 로그인 및 로컬 데이터 스마트 마이그레이션 모듈 구현
- [ ] Vercel 배포 및 도메인 연결

### Phase 2: 리텐션 강화 (모바일 PWA & 알림)
- [ ] PWA 웹 앱 매니페스트 및 오프라인 캐싱
- [ ] 아침 기상 / 원씽 실천 리마인더 웹 푸시 알림
- [ ] 밤 회고 & 내일 원씽 작성 리마인더 웹 푸시 알림

### Phase 3: 소셜 및 커뮤니티 확장
- [ ] 익명 루틴 피드 (오늘 다른 사람들은 어떤 원씽을 달성했는지 보기)
- [ ] 친구와 함께하는 1시간 몰입 스터디룸

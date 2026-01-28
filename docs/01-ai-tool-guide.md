# Giftify Frontend - AI 도구 활용 가이드

> 📅 최종 수정: 2026-01-27  
> 📌 상태: 작성 완료  
> 👥 대상: TEAM 201 프론트엔드 개발자

---

## 📑 목차

1. [개요](#1-개요)
2. [인프라 아키텍처](#2-인프라-아키텍처)
3. [도구별 역할 분담](#3-도구별-역할-분담)
4. [v0 활용 가이드](#4-v0-활용-가이드)
5. [Claude 활용 가이드](#5-claude-활용-가이드)
6. [협업 워크플로우](#6-협업-워크플로우)
7. [환경 설정](#7-환경-설정)

---

## 1. 개요

### 1.1 문서 목적

이 문서는 Giftify 프론트엔드 개발 시 AI 도구(v0, Claude)를 효과적으로 활용하기 위한 가이드라인을 제공합니다.

### 1.2 사용 도구

| 도구 | 버전/플랜 | 용도 |
|------|----------|------|
| **v0 by Vercel** | Pro | UI 컴포넌트 생성, 프로토타이핑 |
| **Claude** | Opus 4.5 | 아키텍처 설계, 복잡한 로직 구현 |
| **Cursor** | Pro | AI 기반 코드 에디터 (선택) |

---

## 2. 인프라 아키텍처

### 2.1 배포 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                        Cloudflare                                │
│  ┌─────────────────┐              ┌─────────────────┐           │
│  │   DNS & CDN     │              │ Cloudflare      │           │
│  │ giftify.app     │              │ Tunnel          │           │
│  └────────┬────────┘              └────────┬────────┘           │
└───────────┼────────────────────────────────┼────────────────────┘
            │                                │
            ▼                                ▼
┌───────────────────────┐      ┌───────────────────────────────┐
│       Vercel          │      │           AWS EC2             │
│  ┌─────────────────┐  │      │  ┌─────────────────────────┐  │
│  │  Next.js App    │  │ ───► │  │   Spring Boot API       │  │
│  │  (Frontend)     │  │ API  │  │   (Backend)             │  │
│  └─────────────────┘  │      │  └─────────────────────────┘  │
│                       │      │  ┌─────────────────────────┐  │
│  • 자동 배포 (GitHub) │      │  │   PostgreSQL            │  │
│  • Edge Functions    │      │  └─────────────────────────┘  │
│  • Preview 배포      │      │                               │
└───────────────────────┘      └───────────────────────────────┘
```

### 2.2 도메인 구조

| 환경 | Frontend URL | Backend API URL |
|------|-------------|-----------------|
| **Production** | `https://giftify.app` | `https://api.giftify.app` |
| **Staging** | `https://staging.giftify.app` | `https://api-staging.giftify.app` |
| **Preview** | `https://*.vercel.app` | `https://api-dev.giftify.app` |
| **Local** | `http://localhost:3000` | `http://localhost:8080` |

### 2.3 Cloudflare Tunnel 연동

```
[Vercel Frontend]
        │
        │ HTTPS Request
        ▼
[Cloudflare DNS] ─── api.giftify.app
        │
        │ Cloudflare Tunnel (encrypted)
        ▼
[cloudflared daemon] ─── EC2 내부
        │
        │ localhost:8080
        ▼
[Spring Boot API]
```

**장점:**
- EC2 포트 노출 불필요 (보안 강화)
- Cloudflare WAF/DDoS 보호
- Zero Trust 네트워크 구성 가능

---

## 3. 도구별 역할 분담

### 3.1 역할 매트릭스

| 작업 유형 | v0 | Claude | 비고 |
|----------|:--:|:------:|------|
| UI 컴포넌트 생성 | ✅ | ⚪ | v0가 shadcn/ui 기반 |
| 페이지 레이아웃 | ✅ | ⚪ | |
| 반응형 디자인 | ✅ | ⚪ | |
| 애니메이션/인터랙션 | ✅ | ⚪ | Framer Motion |
| API 연동 코드 | ⚪ | ✅ | TanStack Query |
| 상태 관리 로직 | ⚪ | ✅ | Zustand |
| 비즈니스 로직 | ⚪ | ✅ | 펀딩 플로우 등 |
| 타입 정의 | ⚪ | ✅ | TypeScript |
| 테스트 코드 | ⚪ | ✅ | Vitest, Testing Library |
| 프로젝트 구조 설계 | ⚪ | ✅ | |
| 환경 설정 | ⚪ | ✅ | Next.js config, 환경변수 |
| 에러 핸들링 | ⚪ | ✅ | Error Boundary |

> ✅ 주 담당 | ⚪ 보조/검토

### 3.2 작업 흐름

```
┌─────────────────────────────────────────────────────────────┐
│  1. 요구사항 정의 (Claude)                                    │
├─────────────────────────────────────────────────────────────┤
│  • 화면 명세 작성                                            │
│  • 데이터 흐름 설계                                          │
│  • API 인터페이스 정의                                        │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  2. UI 컴포넌트 생성 (v0)                                     │
├─────────────────────────────────────────────────────────────┤
│  • 와이어프레임 기반 컴포넌트 생성                             │
│  • Tailwind 스타일링                                         │
│  • 반응형 레이아웃                                            │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  3. 로직 통합 (Claude)                                        │
├─────────────────────────────────────────────────────────────┤
│  • API 연동                                                  │
│  • 상태 관리 연결                                             │
│  • 에러 핸들링                                                │
│  • 타입 안정성 확보                                           │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  4. 검토 & 개선 (Claude + 개발자)                             │
├─────────────────────────────────────────────────────────────┤
│  • 코드 리뷰                                                 │
│  • 성능 최적화                                                │
│  • 접근성 검토                                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. v0 활용 가이드

### 4.1 프롬프트 템플릿

#### 기본 구조

```
[컴포넌트/페이지 이름]을 만들어줘.

## 요구사항
- [기능 1]
- [기능 2]

## 디자인
- [스타일 가이드]
- [색상/폰트]

## 기술 스택
- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui

## 참고
- [추가 컨텍스트]
```

#### 예시: 펀딩 카드 컴포넌트

```
펀딩 카드 컴포넌트를 만들어줘.

## 요구사항
- 상품 이미지 (16:9 비율)
- 상품명, 가격
- 펀딩 진행률 프로그레스 바
- 현재 금액 / 목표 금액 표시
- 남은 기간 (D-day)
- 참여자 수
- 수령자 프로필 (아바타 + 이름)
- 호버 시 살짝 확대 효과

## 디자인
- 카드 형태, 둥근 모서리 (radius-lg)
- 그림자: shadow-md
- 프로그레스 바 색상: 
  - 100% 이상: green-500
  - 70% 이상: blue-500
  - 30% 이상: yellow-500
  - 미만: gray-300

## 기술 스택
- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui (Card, Progress, Avatar)

## Props 타입
interface FundingCardProps {
  funding: {
    id: string;
    productName: string;
    productImage: string;
    targetAmount: number;
    currentAmount: number;
    expiresAt: string;
    participantCount: number;
    recipient: {
      nickname: string;
      avatarUrl: string;
    };
  };
  onClick?: () => void;
}
```

### 4.2 v0 베스트 프랙티스

#### ✅ DO

```markdown
- 구체적인 Props 타입 제공
- shadcn/ui 컴포넌트 명시적 지정
- 색상/간격은 Tailwind 토큰 사용
- 반응형 브레이크포인트 명시 (sm, md, lg)
- 접근성 요구사항 포함 (aria-label 등)
```

#### ❌ DON'T

```markdown
- API 호출 로직 포함 요청 (Claude에서 처리)
- 복잡한 상태 관리 요청
- 전역 상태 접근 요청
- 인증/인가 로직 요청
```

### 4.3 v0 출력물 후처리

v0에서 생성된 코드는 다음 작업이 필요합니다:

```typescript
// v0 출력물 (예시)
export default function FundingCard({ funding }: FundingCardProps) {
  // 정적 UI만 포함
}

// Claude로 보강할 내용
// 1. 이벤트 핸들러 연결
// 2. 로딩/에러 상태 처리
// 3. 실제 데이터 바인딩
// 4. 최적화 (memo, useMemo 등)
```

---

## 5. Claude 활용 가이드

### 5.1 프롬프트 템플릿

#### 아키텍처/설계 요청

```
Giftify 프로젝트의 [기능명] 구현을 위한 설계를 해줘.

## 컨텍스트
- 프로젝트: 그룹 펀딩 서비스
- 기술 스택: Next.js 14, TypeScript, TanStack Query, Zustand
- 관련 도메인: [도메인 설명]

## 요구사항
- [요구사항 1]
- [요구사항 2]

## 기대 출력
- 폴더 구조
- 주요 파일 목록
- 핵심 타입 정의
- 데이터 흐름 설명
```

#### API 연동 코드 요청

```
[API 엔드포인트] 연동 코드를 작성해줘.

## API 스펙
- Method: POST
- URL: /api/fundings
- Request Body: { ... }
- Response: { ... }

## 요구사항
- TanStack Query useMutation 사용
- 낙관적 업데이트 적용
- 에러 핸들링 (토스트 알림)
- 로딩 상태 관리

## 관련 타입
[TypeScript 타입 정의]
```

#### 비즈니스 로직 요청

```
펀딩 참여 플로우의 비즈니스 로직을 구현해줘.

## 플로우
1. 사용자가 참여 금액 입력
2. 유효성 검증 (최소 금액, 잔액 확인)
3. 장바구니 추가 API 호출
4. 성공 시 장바구니 페이지로 이동
5. 실패 시 에러 메시지 표시

## 고려사항
- 중복 참여 방지
- 동시성 이슈 처리
- 잔액 부족 시 충전 페이지 유도
```

### 5.2 Claude에게 제공할 컨텍스트

효과적인 응답을 위해 다음 문서를 함께 제공하세요:

```markdown
## 필수 컨텍스트
1. 도메인 아키텍처 문서 (현재 문서)
2. OpenAPI 스펙 (api-spec.yaml)
3. 관련 화면 와이어프레임

## 선택 컨텍스트
4. 기존 코드 (관련 컴포넌트/훅)
5. 에러 케이스 목록
6. 디자인 시스템 토큰
```

### 5.3 Claude 출력물 체크리스트

```markdown
□ TypeScript 타입 안정성
□ 에러 핸들링 완비
□ 로딩 상태 처리
□ 엣지 케이스 고려
□ 테스트 용이성 (의존성 주입)
□ 재사용성 (Props 인터페이스)
□ 성능 고려 (메모이제이션)
```

---

## 6. 협업 워크플로우

### 6.1 기능 개발 프로세스

```
┌────────────────────────────────────────────────────────────────┐
│ Step 1: 요구사항 분석                                           │
├────────────────────────────────────────────────────────────────┤
│ • Jira 티켓 확인                                                │
│ • Claude에게 요구사항 명확화 요청                                │
│ • 필요시 와이어프레임 참조                                       │
└────────────────────────────────────────────────────────────────┘
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ Step 2: UI 컴포넌트 생성 (v0)                                   │
├────────────────────────────────────────────────────────────────┤
│ • 와이어프레임 기반 프롬프트 작성                                 │
│ • v0에서 컴포넌트 생성                                          │
│ • 생성된 코드 프로젝트에 복사                                    │
└────────────────────────────────────────────────────────────────┘
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ Step 3: 로직 구현 (Claude)                                      │
├────────────────────────────────────────────────────────────────┤
│ • API 연동 훅 작성                                              │
│ • 상태 관리 로직 구현                                           │
│ • v0 컴포넌트와 통합                                            │
└────────────────────────────────────────────────────────────────┘
                              ▼
┌────────────────────────────────────────────────────────────────┐
│ Step 4: 통합 & 테스트                                           │
├────────────────────────────────────────────────────────────────┤
│ • 로컬 환경 테스트                                              │
│ • Vercel Preview 배포 확인                                      │
│ • 코드 리뷰 요청                                                │
└────────────────────────────────────────────────────────────────┘
```

### 6.2 브랜치 전략

```
main
  │
  ├── develop
  │     │
  │     ├── feature/funding-create
  │     │     • v0: UI 컴포넌트
  │     │     • Claude: 비즈니스 로직
  │     │
  │     ├── feature/cart-checkout
  │     │
  │     └── feature/wallet-charge
  │
  └── release/v1.0.0
```

### 6.3 커밋 컨벤션

```
feat(funding): 펀딩 카드 컴포넌트 추가 [v0]
feat(funding): 펀딩 생성 API 연동 [claude]
style(funding): 카드 호버 애니메이션 개선
fix(cart): 금액 계산 오류 수정
```

---

## 7. 환경 설정

### 7.1 환경 변수

```bash
# .env.local (로컬 개발)
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_AUTH0_DOMAIN=dev-xxx.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=xxx
NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.giftify.app

# .env.production (Vercel 프로덕션)
NEXT_PUBLIC_API_URL=https://api.giftify.app
NEXT_PUBLIC_AUTH0_DOMAIN=giftify.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=xxx
NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.giftify.app
```

### 7.2 Vercel 설정

```json
// vercel.json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.giftify.app/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### 7.3 Cloudflare 설정

#### DNS 레코드

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | @ | cname.vercel-dns.com | ✅ |
| CNAME | api | [tunnel-id].cfargotunnel.com | ✅ |
| CNAME | api-staging | [tunnel-id].cfargotunnel.com | ✅ |

#### Tunnel 설정 (EC2)

```yaml
# ~/.cloudflared/config.yml
tunnel: giftify-api
credentials-file: /home/ec2-user/.cloudflared/credentials.json

ingress:
  - hostname: api.giftify.app
    service: http://localhost:8080
  - hostname: api-staging.giftify.app
    service: http://localhost:8081
  - service: http_status:404
```

### 7.4 CORS 설정 (Backend)

```kotlin
// Spring Security 설정
@Configuration
class CorsConfig {
    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration().apply {
            allowedOrigins = listOf(
                "https://giftify.app",
                "https://staging.giftify.app",
                "https://*.vercel.app",  // Preview 배포
                "http://localhost:3000"   // 로컬 개발
            )
            allowedMethods = listOf("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            allowedHeaders = listOf("*")
            allowCredentials = true
        }
        return UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/**", configuration)
        }
    }
}
```

---

## 📎 부록

### A. 유용한 프롬프트 모음

#### 컴포넌트 리팩토링 (Claude)

```
이 v0 생성 컴포넌트를 프로덕션 레벨로 리팩토링해줘.

[v0 코드 붙여넣기]

## 요구사항
- Props 타입 분리 (types.ts)
- 로딩/에러 상태 추가
- 접근성 개선
- 테스트 코드 작성
```

#### 복잡한 폼 (Claude → v0)

```
1. [Claude] 폼 유효성 검증 스키마와 타입 정의
2. [v0] UI 컴포넌트 생성 (타입 제공)
3. [Claude] React Hook Form 연동
```

### B. 트러블슈팅

| 문제 | 해결 |
|------|------|
| v0 코드가 타입 에러 발생 | Claude에게 타입 수정 요청 |
| API 호출 시 CORS 에러 | Vercel rewrites 또는 백엔드 CORS 설정 확인 |
| Cloudflare Tunnel 연결 안됨 | `cloudflared tunnel run` 상태 확인 |
| Auth0 토큰 갱신 안됨 | `useAuth0` 훅의 `getAccessTokenSilently` 사용 확인 |

---

## 📚 관련 문서

- [Giftify 도메인 아키텍처](./04-domain-architecture.md)
- [API 스펙 (OpenAPI)](./03-api-spec.yaml)
- [와이어프레임](./02-wireframes.md)

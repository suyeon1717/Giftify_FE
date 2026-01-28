# Giftify Frontend Implementation Summary

> Date: 2026-01-28
> Scope: GIFTIFY
> Author: Claude (AI Assistant)

---

## 1. Background

Giftify는 친구들이 함께 선물을 구매하는 그룹 펀딩 서비스이다. 이 문서는 프론트엔드 구현 과정에서 수행된 작업, 발견된 문제점, 해결 방법, 그리고 후속 작업자를 위한 인수인계 정보를 담고 있다.

### 1.1 기술 스택

```
+------------------+------------------------------------------+
| Category         | Technology                               |
+------------------+------------------------------------------+
| Framework        | Next.js 14 (App Router)                  |
| Language         | TypeScript (strict mode)                 |
| Styling          | Tailwind CSS + shadcn/ui                 |
| State (Server)   | TanStack Query v5                        |
| State (Client)   | Zustand                                  |
| Auth             | Auth0 (@auth0/nextjs-auth0)              |
| Forms            | React Hook Form + Zod                    |
| Testing          | Vitest + React Testing Library           |
| Mocking          | MSW (Mock Service Worker)                |
+------------------+------------------------------------------+
```

### 1.2 구현 범위

13개 Phase로 나뉜 전체 구현 계획 중 **13개 Phase 모두 완료**되었다.

---

## 2. Completed Work Summary

### Phase 1: Foundation & Types
- OpenAPI 스펙 기반 TypeScript 타입 정의
- `PageInfo`, `PaginatedResponse<T>` 타입 수정 (API 스펙 일치)
- API 클라이언트 모듈 생성 (`src/lib/api/*.ts`)
- MSW 목 서버 설정

### Phase 2: Authentication
- Auth0 SDK 통합
- 미들웨어 기반 라우트 보호 (`src/middleware.ts`)
- 로그인/로그아웃 UI 컴포넌트
- 인증된 API 클라이언트 래퍼

### Phase 3: TanStack Query Integration
- Query Client 설정 및 Provider 구성
- 도메인별 Query/Mutation 훅 생성
- 캐시 무효화 전략 수립 (`src/lib/query/keys.ts`)

### Phase 4: Home Page
- 홈 페이지 API 연동
- 로딩 스켈레톤, 빈 상태 UI
- 펀딩 캐러셀, 친구 위시리스트 섹션

### Phase 5: Product Search & Detail
- 상품 검색 페이지 (`/products`)
- 상품 상세 페이지 (`/products/[id]`)
- 검색 필터, 무한 스크롤

### Phase 6: Wishlist
- 내 위시리스트, 친구 위시리스트 페이지
- 공개 범위 변경 기능
- 아이템 추가/삭제

### Phase 7: Funding Flow
- 펀딩 상세 페이지
- 펀딩 생성 모달 (API 스펙에 맞게 재설계)
- 펀딩 참여 모달
- 수령인 수락/거부 기능

### Phase 8: Cart & Checkout
- 장바구니 페이지 (펀딩 참여 모델로 재설계)
- 결제 페이지 (지갑 결제)
- 결제 완료 페이지

### Phase 9: Wallet
- 지갑 잔액 표시
- 충전 기능
- 거래 내역 표시

### Phase 10: My Page
- 프로필 정보 표시/수정
- 펀딩 활동 메뉴
- 로그아웃 기능

### Phase 11: Error Handling & Polish
- 글로벌 에러 바운더리 (`src/app/error.tsx`)
- 404 페이지 (`src/app/not-found.tsx`)
- 에러 메시지 한글화 (`src/lib/error/error-messages.ts`)
- 토스트 유틸리티 표준화
- 오프라인 인디케이터
- TanStack Query 재시도 로직 추가

### Phase 12: Testing
- 테스트 유틸리티 설정 (`src/test/test-utils.tsx`)
- 주요 페이지 컴포넌트 테스트
- 12개 테스트 케이스 통과

### Phase 13: Performance & Optimization
- SEO 메타데이터 설정 (`src/lib/seo/metadata.ts`)
- 이미지 최적화 컴포넌트 (`OptimizedImage`)
- 데이터 프리페칭 유틸리티
- PWA 매니페스트, robots.txt

---

## 3. Issues Encountered and Resolutions

### 3.1 Next.js 15+ params Promise 변경

**문제**: Next.js 15 이상에서 동적 라우트의 `params`가 Promise로 변경됨

```
Error: A param property was accessed directly with `params.id`.
`params` is a Promise and must be unwrapped with `React.use()`
```

**영향 파일**:
- `src/app/products/[id]/page.tsx`
- `src/app/wishlist/[userId]/page.tsx`

**해결**:
```typescript
// Before (Wrong)
export default function Page({ params }: { params: { id: string } }) {
  const { data } = useQuery(params.id);
}

// After (Correct)
import { use } from 'react';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data } = useQuery(id);
}
```

**참고**: `useParams()` 훅을 사용하는 경우는 문제없음 (`src/app/fundings/[id]/page.tsx`).

---

### 3.2 Next.js Image 도메인 미설정

**문제**: 외부 이미지 도메인 `picsum.photos`가 설정되지 않음

```
Error: Invalid src prop (https://picsum.photos/...) hostname "picsum.photos"
is not configured under images in your next.config.js
```

**해결**: `next.config.ts`에 remotePatterns 추가

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
};
```

---

### 3.3 빈 이미지 src 오류

**문제**: ProductImages 컴포넌트에서 빈 문자열 이미지 URL 처리 미흡

```
Error: An empty string ("") was passed to the src attribute
```

**해결**: `src/features/product/components/ProductImages.tsx`에서 유효한 이미지만 필터링

```typescript
// Filter out empty strings and invalid URLs
const validImages = images?.filter((img) => img && img.trim() !== '') || [];

if (validImages.length === 0) {
  return <div>No image available</div>;
}
```

---

### 3.4 ProductInfo undefined price 오류

**문제**: `product.price`가 undefined일 때 `toLocaleString()` 호출 실패

```
Error: Cannot read properties of undefined (reading 'toLocaleString')
```

**해결**: Optional chaining과 nullish coalescing 적용

```typescript
// Before
₩{product.price.toLocaleString()}

// After
₩{product.price?.toLocaleString() ?? 0}
```

---

### 3.5 BottomNav 검색 탭 라우팅 오류

**문제**: 검색 탭 클릭 시 상품 상세 페이지로 이동

**원인**: `/products/search` 경로가 `/products/[id]` 동적 라우트에 매칭되어 "search"가 상품 ID로 인식됨

**해결**: BottomNav에서 검색 탭 href를 `/products`로 변경

```typescript
// Before
{ label: '검색', href: '/products/search', ... }

// After
{ label: '검색', href: '/products', ... }
```

---

### 3.6 테스트 QueryClient 미설정

**문제**: 테스트 실행 시 "No QueryClient set" 오류

**해결**: `src/test/test-utils.tsx` 생성

```typescript
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

function customRender(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: TestWrapper, ...options });
}

export { customRender as render };
```

---

### 3.7 테스트 Mock 누락

**문제**: 여러 hook mock이 누락되어 테스트 실패

**해결된 mock들**:
- `useToggleCartSelection` - CartPage 테스트
- `useCreatePayment` - CheckoutPage 테스트
- `useParticipateFunding` - ParticipateModal 테스트

**WalletPage 데이터 구조 문제**:
```typescript
// Page uses historyData?.content, but mock only had items
// Fixed by providing both:
useWalletHistory: () => ({
  data: {
    content: mockTransactions,  // Page uses this
    items: mockTransactions,    // Type has both
    page: { ... }
  },
}),
```

---

## 4. Architecture Diagram

```
+------------------------------------------------------------------+
|                        Next.js App Router                         |
+------------------------------------------------------------------+
|                                                                    |
|  +------------------+    +------------------+    +---------------+ |
|  |   Pages (app/)   |    |   Components     |    |   Features    | |
|  +------------------+    +------------------+    +---------------+ |
|  | /                |    | /ui (shadcn)     |    | /auth         | |
|  | /products        |    | /layout          |    | /cart         | |
|  | /products/[id]   |    | /common          |    | /checkout     | |
|  | /fundings/[id]   |    +------------------+    | /funding      | |
|  | /cart            |                           | /home         | |
|  | /checkout        |                           | /product      | |
|  | /wallet          |                           | /profile      | |
|  | /wishlist        |                           | /wallet       | |
|  | /profile         |                           | /wishlist     | |
|  +------------------+                           +---------------+ |
|                                                                    |
+------------------------------------------------------------------+
|                        State Management                           |
+------------------------------------------------------------------+
|                                                                    |
|  +------------------------+    +-----------------------------+    |
|  |   TanStack Query       |    |         Zustand             |    |
|  |   (Server State)       |    |     (Client State)          |    |
|  +------------------------+    +-----------------------------+    |
|  | - API data caching     |    | - UI state                  |    |
|  | - Optimistic updates   |    | - User preferences          |    |
|  | - Background refetch   |    |                             |    |
|  +------------------------+    +-----------------------------+    |
|                                                                    |
+------------------------------------------------------------------+
|                          API Layer                                |
+------------------------------------------------------------------+
|                                                                    |
|  +------------------+    +------------------+    +---------------+ |
|  |  API Client      |    |  MSW (Dev Mock)  |    |  Auth0        | |
|  |  (src/lib/api)   |    |  (src/mocks)     |    |  Integration  | |
|  +------------------+    +------------------+    +---------------+ |
|                                                                    |
+------------------------------------------------------------------+
```

---

## 5. File Structure (Key Files)

```
src/
├── app/
│   ├── api/auth/[auth0]/route.ts    # Auth0 API routes
│   ├── products/
│   │   ├── page.tsx                 # Product search (검색 탭)
│   │   └── [id]/page.tsx            # Product detail
│   ├── fundings/[id]/page.tsx       # Funding detail
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── wallet/page.tsx
│   ├── wishlist/
│   │   ├── page.tsx                 # My wishlist
│   │   └── [userId]/page.tsx        # Friend's wishlist
│   ├── profile/page.tsx
│   ├── error.tsx                    # Global error boundary
│   ├── not-found.tsx                # 404 page
│   └── layout.tsx                   # Root layout with providers
├── middleware.ts                    # Auth route protection
├── components/
│   ├── ui/                          # shadcn/ui components
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Header.tsx
│   │   └── BottomNav.tsx
│   └── common/
│       ├── OptimizedImage.tsx
│       ├── OfflineIndicator.tsx
│       └── ...
├── features/
│   └── {domain}/
│       ├── components/
│       ├── hooks/
│       └── api/
├── lib/
│   ├── api/                         # API client functions
│   ├── query/keys.ts                # Query key constants
│   ├── error/                       # Error handling utilities
│   ├── seo/metadata.ts              # SEO configuration
│   ├── prefetch/prefetch.ts         # Data prefetching
│   └── providers.tsx                # React Query, Auth providers
├── mocks/                           # MSW mock handlers
├── test/test-utils.tsx              # Test utilities
└── types/                           # TypeScript type definitions
```

---

## 6. Git Workflow

모든 Phase는 다음 Git 워크플로우를 따랐다:

```
1. feature/phase-N-description 브랜치 생성
2. 작업 단위별 커밋
3. main 브랜치로 --no-ff 머지
```

### Recent Commits (Phase 11-13)

```
f655939 Merge branch 'feature/phase-13-performance'
a8c7559 Merge branch 'feature/phase-12-testing'
12f31fc Merge branch 'feature/phase-11-error-handling'
```

---

## 7. Pending Items for Next Developer

### 7.1 알려진 이슈

1. **MSW 목 데이터 정합성**: 일부 목 데이터가 실제 API 스펙과 다를 수 있음. 백엔드 연동 시 검증 필요.

2. **이미지 도메인 추가 필요**: 실제 백엔드 이미지 서버 도메인을 `next.config.ts`에 추가해야 함.

3. **Auth0 환경 변수**: 실제 Auth0 tenant 정보로 환경 변수 설정 필요.

### 7.2 백엔드 연동 시 확인 사항

1. **PageInfo 타입 확인**:
   ```typescript
   // 현재 구현
   interface PageInfo {
     page: number;
     size: number;
     totalElements: number;
     totalPages: number;
     hasNext: boolean;
     hasPrevious: boolean;
   }
   ```
   백엔드 응답과 일치하는지 확인.

2. **에러 응답 형식 확인**:
   ```typescript
   interface ErrorResponse {
     code: string;
     message: string;
     timestamp: string;
   }
   ```

3. **인증 토큰 형식**: Bearer 토큰 사용 여부, 헤더 이름 확인.

### 7.3 권장 후속 작업

| Priority | Task | Description |
|----------|------|-------------|
| High | 백엔드 API 연동 | MSW 제거 후 실제 API 연결 |
| High | E2E 테스트 추가 | Playwright 또는 Cypress로 주요 플로우 테스트 |
| Medium | 접근성 개선 | ARIA 속성 추가, 키보드 내비게이션 |
| Medium | 다국어 지원 | i18n 설정 (현재 한국어만 지원) |
| Low | 애니메이션 추가 | Framer Motion으로 페이지 전환 애니메이션 |

---

## 8. Commands Reference

```bash
# Development
npm run dev              # Start dev server (port 3000)

# Build
npm run build            # Production build
npm run start            # Start production server

# Testing
npm run test             # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage

# Linting
npm run lint             # ESLint check
npm run lint:fix         # ESLint auto-fix
```

---

## 9. Environment Variables Template

```bash
# .env.local

# API
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Auth0
AUTH0_SECRET='[generate with: openssl rand -hex 32]'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://your-tenant.auth0.com'
AUTH0_CLIENT_ID='your-client-id'
AUTH0_CLIENT_SECRET='your-client-secret'
AUTH0_AUDIENCE='https://api.giftify.app'
```

---

## 10. Conclusion

Giftify 프론트엔드 구현의 13개 Phase가 모두 완료되었다. 빌드 및 테스트가 정상적으로 통과하며, MSW를 통한 목 서버로 개발 환경에서 전체 기능을 테스트할 수 있다.

후속 작업자는 백엔드 API 연동을 시작할 때 본 문서의 "Pending Items" 섹션을 참고하여 데이터 타입 정합성을 확인하고, 실제 환경에 맞는 환경 변수를 설정해야 한다.

---

**Document Version**: 1.0
**Last Updated**: 2026-01-28

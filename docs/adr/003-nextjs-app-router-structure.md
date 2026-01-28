# ADR-003: Next.js App Router Structure

> Date: 2026-01-28
> Status: Accepted
> Deciders: Development Team

---

## Context

Next.js 14의 App Router를 사용하여 라우팅 구조를 설계해야 했다. 고려 사항:

1. 인증 필요 라우트 vs 공개 라우트 구분
2. 동적 라우트 처리
3. 레이아웃 공유 전략

---

## Decision

### Route Structure

```
app/
├── page.tsx                    # / (Home)
├── layout.tsx                  # Root layout
├── error.tsx                   # Global error boundary
├── not-found.tsx               # 404 page
│
├── products/
│   ├── page.tsx                # /products (Search)
│   └── [id]/
│       └── page.tsx            # /products/:id (Detail)
│
├── fundings/
│   └── [id]/
│       └── page.tsx            # /fundings/:id (Detail)
│
├── cart/
│   └── page.tsx                # /cart
│
├── checkout/
│   └── page.tsx                # /checkout
│
├── wallet/
│   └── page.tsx                # /wallet
│
├── wishlist/
│   ├── page.tsx                # /wishlist (My)
│   └── [userId]/
│       └── page.tsx            # /wishlist/:userId (Friend's)
│
├── profile/
│   └── page.tsx                # /profile
│
└── api/
    └── auth/
        └── [auth0]/
            └── route.ts        # Auth0 API routes
```

### Authentication Strategy

**Middleware 기반 라우트 보호** 사용 (Route Groups 대신)

```typescript
// src/middleware.ts
import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    '/cart/:path*',
    '/checkout/:path*',
    '/wallet/:path*',
    '/wishlist/:path*',
    '/profile/:path*',
  ],
};
```

**선택 이유**:
- Route Groups `(auth)/(public)`은 URL에 영향 없지만 파일 구조 복잡화
- Middleware는 한 곳에서 모든 보호 로직 관리
- Auth0 SDK의 middleware helper 활용 가능

---

## Dynamic Route Gotchas

### 1. Static vs Dynamic Route Priority

Next.js는 정적 라우트를 동적 라우트보다 우선한다.

```
/products/search    →  /products/search/page.tsx (존재하면)
/products/search    →  /products/[id]/page.tsx   (없으면 - search가 id로 매칭)
```

**해결**: 검색 기능은 `/products` 페이지에 통합하고, query parameter 사용

```
/products?q=airpods&category=electronics
```

### 2. Params as Promise (Next.js 15+)

Next.js 15 이상에서 `params`가 Promise로 변경됨.

```typescript
// Wrong
export default function Page({ params }: { params: { id: string } }) {
  console.log(params.id); // Error!
}

// Correct
import { use } from 'react';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
}

// Alternative: useParams hook (client component)
'use client';
import { useParams } from 'next/navigation';

export default function Page() {
  const { id } = useParams();
}
```

---

## Layout Strategy

```
+----------------------------------------------------------+
|                     RootLayout                            |
|  (html, body, providers, fonts)                           |
+----------------------------------------------------------+
|                                                           |
|  +-----------------------------------------------------+  |
|  |                    AppShell                         |  |
|  |  +-----------------------------------------------+  |  |
|  |  |                  Header                       |  |  |
|  |  +-----------------------------------------------+  |  |
|  |  |                                               |  |  |
|  |  |                  Content                      |  |  |
|  |  |                  (children)                   |  |  |
|  |  |                                               |  |  |
|  |  +-----------------------------------------------+  |  |
|  |  |                 BottomNav                     |  |  |
|  |  +-----------------------------------------------+  |  |
|  +-----------------------------------------------------+  |
|                                                           |
+----------------------------------------------------------+
```

- **RootLayout**: Providers (QueryClient, Auth, Toaster)
- **AppShell**: 페이지별 Header/BottomNav 설정 (props로 제어)

---

## Consequences

### Positive
- 단순한 파일 구조
- Middleware로 인증 로직 중앙화
- 유연한 레이아웃 구성

### Negative
- 동적 라우트 충돌 주의 필요
- Next.js 버전 업그레이드 시 params 처리 방식 변경 가능

---

## References

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Auth0 Next.js SDK](https://github.com/auth0/nextjs-auth0)

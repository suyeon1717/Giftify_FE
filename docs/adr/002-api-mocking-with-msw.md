# ADR-002: API Mocking with MSW

> Date: 2026-01-28
> Status: Accepted
> Deciders: Development Team

---

## Context

백엔드 API 개발이 프론트엔드와 병렬로 진행되어, 프론트엔드 개발 중 실제 API를 사용할 수 없는 상황이었다. API 모킹 전략이 필요했다.

---

## Decision

**MSW (Mock Service Worker)** 를 사용하여 네트워크 레벨에서 API를 모킹한다.

```
+----------------------------------------------------------+
|                    Browser/Node                           |
+----------------------------------------------------------+
|                          |                                |
|    Application Code      |     MSW Service Worker         |
|    (fetch/axios)         |     (Intercepts requests)      |
|          |               |            |                   |
|          +------> Request --------> Handler               |
|                                        |                  |
|          <------ Response <--------+                      |
|                                                           |
+----------------------------------------------------------+
```

---

## Rationale

### MSW vs 다른 옵션들

| Option | Pros | Cons |
|--------|------|------|
| **MSW** | 네트워크 레벨 모킹, 실제 fetch 사용, 테스트 재사용 | 초기 설정 필요 |
| json-server | 빠른 설정 | REST only, 커스텀 로직 어려움 |
| Mock 함수 | 단순함 | fetch 호출 자체를 모킹 못함 |
| Nock | Node.js 테스트용 | 브라우저 미지원 |

---

## Implementation

### Directory Structure

```
src/mocks/
├── browser.ts       # Browser service worker setup
├── handlers.ts      # Request handlers (barrel)
├── handlers/
│   ├── auth.ts
│   ├── cart.ts
│   ├── fundings.ts
│   ├── home.ts
│   ├── products.ts
│   ├── wallet.ts
│   └── wishlists.ts
└── data/
    ├── fundings.ts  # Mock data fixtures
    ├── products.ts
    └── users.ts
```

### Handler Example

```typescript
// src/mocks/handlers/fundings.ts
import { http, HttpResponse } from 'msw';

export const fundingHandlers = [
  http.get('/api/fundings/:id', ({ params }) => {
    const { id } = params;
    const funding = mockFundings.find(f => f.id === id);

    if (!funding) {
      return HttpResponse.json(
        { code: 'FUNDING_NOT_FOUND', message: '펀딩을 찾을 수 없습니다' },
        { status: 404 }
      );
    }

    return HttpResponse.json(funding);
  }),
];
```

### Provider Integration

```typescript
// src/lib/providers/msw-provider.tsx
'use client';

import { useEffect, useState } from 'react';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@/mocks/browser').then(({ worker }) => {
        worker.start({ onUnhandledRequest: 'bypass' });
        setReady(true);
      });
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
```

---

## Consequences

### Positive
- 백엔드 없이 전체 기능 개발 가능
- 테스트에서 동일한 핸들러 재사용
- 네트워크 탭에서 요청/응답 확인 가능
- 에러 시나리오 쉽게 시뮬레이션

### Negative
- Mock 데이터가 실제 API 응답과 달라질 위험
- 초기 설정 복잡도

### Mitigation
- OpenAPI 스펙에서 타입 생성하여 Mock 데이터 타입 검증
- 백엔드 연동 시 Integration test 작성

---

## Migration to Real API

백엔드 준비 시 다음 순서로 마이그레이션:

1. `MSWProvider`를 조건부 로딩에서 제거
2. `NEXT_PUBLIC_API_URL` 환경 변수를 실제 URL로 변경
3. 각 API 호출 테스트
4. MSW 핸들러는 테스트 용도로 유지

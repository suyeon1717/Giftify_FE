# ADR-001: State Management Strategy

> Date: 2026-01-28
> Status: Accepted
> Deciders: Development Team

---

## Context

Giftify 프론트엔드에서 상태 관리 전략을 결정해야 했다. 고려해야 할 상태 유형:

1. **서버 상태**: API에서 가져오는 데이터 (펀딩, 장바구니, 지갑 등)
2. **클라이언트 상태**: UI 상태, 사용자 설정
3. **폼 상태**: 입력 값, 유효성 검사

---

## Decision

### 서버 상태: TanStack Query v5

```
+--------------------------------------------------+
|                 TanStack Query                    |
+--------------------------------------------------+
| - Automatic caching & background refetch         |
| - Optimistic updates                             |
| - Pagination & infinite scroll support           |
| - Devtools for debugging                         |
+--------------------------------------------------+
```

**선택 이유**:
- 서버 상태 캐싱과 동기화를 자동 처리
- 로딩/에러 상태 자동 관리
- Optimistic update로 UX 개선
- Redux Toolkit Query 대비 더 가벼움

### 클라이언트 상태: Zustand

```
+--------------------------------------------------+
|                    Zustand                        |
+--------------------------------------------------+
| - Minimal boilerplate                            |
| - TypeScript friendly                            |
| - No Provider wrapping needed                    |
| - Persist middleware available                   |
+--------------------------------------------------+
```

**선택 이유**:
- Redux 대비 훨씬 적은 보일러플레이트
- Context API 대비 리렌더링 최적화 용이
- 작은 번들 사이즈

### 폼 상태: React Hook Form + Zod

**선택 이유**:
- Controlled input 대비 성능 우수
- Zod로 런타임 + 타입 검증 통합

---

## Consequences

### Positive
- 서버/클라이언트 상태 관심사 분리
- 캐시 무효화 전략 명확화 가능
- 코드량 감소

### Negative
- 팀원 학습 곡선 (TanStack Query 경험 필요)
- 두 가지 상태 관리 라이브러리 사용

---

## Implementation Details

### Query Keys 구조 (`src/lib/query/keys.ts`)

```typescript
export const queryKeys = {
  // Fundings
  fundings: ['fundings'] as const,
  funding: (id: string) => ['fundings', id] as const,

  // Cart
  cart: ['cart'] as const,

  // Wallet
  wallet: ['wallet'] as const,
  walletHistory: ['wallet', 'history'] as const,

  // Wishlist
  myWishlist: ['wishlists', 'me'] as const,
  wishlist: (memberId: string) => ['wishlists', memberId] as const,
};
```

### Cache Invalidation Rules

| Mutation | Invalidate Keys |
|----------|-----------------|
| Add to cart | `cart`, `funding(id)` |
| Create funding | `myWishlist`, `home` |
| Charge wallet | `wallet`, `walletHistory` |
| Pay order | `wallet`, `cart`, affected fundings |

---

## Alternatives Considered

### Redux Toolkit
- Rejected: 보일러플레이트 과다, 서버 상태 처리에 별도 설정 필요

### Jotai/Recoil
- Rejected: 원자적 상태 관리 필요 없음

### Context API only
- Rejected: 리렌더링 최적화 어려움

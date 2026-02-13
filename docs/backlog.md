# 프로젝트 백로그

> 최종 수정: 2026-02-10 (5차 업데이트 - 코드베이스 전수 대조)
> 분류 기준: 프론트엔드 관점, 우선순위(P0~P2) + 백엔드 의존성 명시
>
> **관련 문서:**
> - 마스터 백로그 (SSoT): `.serena/memories/improvement-backlog.md`
> - 프로덕션 완성 로드맵: `docs/plans/2026-02-08-production-completion-roadmap.md`
> - 백엔드 백로그 스냅샷: `docs/workthrough/260203-GIFTIFY-01-improvement-backlog-report.md`
> - 프론트엔드 백로그: `docs/workthrough/260207-GIFTIFY-02-frontend-backlog.md`

---

## 테스트 현황 (2026-02-10 기준)

```
전체: 14 파일, 50 테스트
통과: 10 파일, 42 테스트
실패: 4 파일, 8 테스트 (F9, F10, F11, F12)
```

---

## 할 일 (To Do)

### P0: 백엔드 연동 (High Priority)

MSW 목 데이터 기반에서 실제 백엔드 API로 전환하는 작업입니다.
현재 13개 Phase 구현이 완료되어 페이지/컴포넌트는 존재하나, 대부분 MSW 기반으로 동작 중입니다.

#### A2-1. 장바구니 API 백엔드 동작 검증 ⚠️

- **상태**: 부분 해결 — `clearCart`만 API 없음, 나머지 검증 필요
- **설명**: 장바구니 아이템 수정/삭제는 프론트에 구현 완료, 실 백엔드 동작 미검증
- **현황**:
  - `PATCH /api/v2/carts/items` - `updateCartItem()` 구현됨, **동작 검증 필요**
  - `DELETE /api/v2/carts/items/{targetType}/{targetId}` - `removeCartItem()` 구현됨, **동작 검증 필요**
  - `DELETE /api/v2/carts` - `clearCart()` **여전히 throw** (백엔드 API 없음)
- **프론트 파일**: `src/lib/api/cart.ts`

#### ~~A3. 펀딩 생성 API 연동~~ ✅

- **상태**: 완료 (2026-02-08)
- **설명**: 친구 위시리스트에서 펀딩 개설하는 기능
- **해결**: 장바구니 기반 플로우로 동작 확인
  - 위시리스트 → CreateFundingModal → `POST /api/v2/carts` (FUNDING_PENDING) → 장바구니 → 체크아웃
  - `POST /api/fundings`는 별도 존재하지 않으며, 주문 시 펀딩이 생성되는 구조

#### A7. `POST /api/v2/orders` 400 에러 - Java `-parameters` 컴파일 플래그 (백엔드)

- **상태**: ⚠️ 백엔드팀 수정 필요
- **현상**: 주문+결제 API 호출 시 400 Bad Request 반환
- **원인**: Java record DTO의 파라미터 이름이 리플렉션에서 인식되지 않음
- **에러 메시지**:
  ```
  Name for argument of type [java.lang.Long] not specified, and parameter
  name information not available via reflection. Ensure that the compiler
  uses the '-parameters' flag.
  ```
- **영향 범위**: `PlaceOrderRequest`, `PlaceOrderItemRequest` 등 Java record 기반 DTO 전체
- **해결 방법**: `build.gradle`의 `compileJava` 태스크에 `-parameters` 옵션 추가
- **상세 명세**: 아래 "백엔드 요청 명세" 섹션 참조
- **우선순위**: 높음 (결제 플로우 전체 차단)

#### A5. 결제(Payment) - Toss PG SDK 연동 ⚠️

- **상태**: SDK 훅 완성, 수정 금지 영역 확인만 필요
- **설명**: 예치금 충전을 위한 Toss PG 결제 연동
- **프론트 현황**:
  - `useTossPayments` 훅 완성 (SDK 로딩, 결제 요청, 에러 처리)
  - `useTossPayments.test.ts` **7/7 테스트 통과**
  - charge 성공/실패 콜백 페이지 존재 (`/wallet/charge/success`, `/wallet/charge/fail`)
  - API 함수 완성: `createChargePayment()`, `confirmPayment()`
- **남은 작업**: `src/features/payment/`가 수정 금지 영역 — 담당자에게 확인 후 통합
- **백엔드 API**:
  - `POST /api/v2/payments/charge` - 결제 생성
  - `POST /api/v2/payments/confirm` - 결제 승인

#### A6. 지갑(Wallet) API 연동 검증

- **상태**: API 함수 완성, 프로필 잔액 연동 확인됨, 나머지 검증 필요
- **설명**: 지갑 잔액 조회, 거래 내역 조회, 출금 API 실제 연동
- **프론트 현황**:
  - `getWallet()` — 프로필 페이지에서 실 연동 완료 (2026-02-08)
  - `getWalletHistory()` — 지갑 페이지에서 사용 중, 응답 형식 검증 필요
  - `withdrawWallet()` — 구현 완료, 실 테스트 필요
- **백엔드 API**:
  - `GET /api/v2/wallet/balance` - 잔액 조회
  - `GET /api/v2/wallet/history` - 거래 내역 조회 (페이징)
  - `POST /api/v2/wallet/withdraw` - 출금 요청

---

### P1: 코드 품질 (프론트 자체 해결 가능)

#### F7. 결제 페이지 TODO 해결 (백엔드 협의 필요)

- **상태**: 백엔드 협의 필요
- **파일**: `src/app/checkout/page.tsx`
- **이슈**:
  - `:32` - Cart 응답에서 `wishlistItemId` 제공 여부 백엔드 협의 필요
  - `:38` - Cart 아이템에 `receiverId` 포함 필요 (현재 임시값 `0`)
- **영향**: 주문 생성 시 정확한 `wishlistItemId`와 `receiverId`가 없으면 결제 플로우 불완전

#### F9. CheckoutPage.test.tsx 3건 전체 실패 (수정 금지 영역)

- **상태**: 담당자 확인 필요
- **파일**: `src/features/payment/components/__tests__/CheckoutPage.test.tsx`
- **이슈**: Wallet 타입 불일치 + Query/데이터 설정 문제로 3/3 실패
- **주의**: `src/features/payment/`는 수정 금지 영역

#### F10. Header.test.tsx 3건 전체 실패 (신규)

- **상태**: 미착수
- **파일**: `src/components/layout/__tests__/Header.test.tsx`
- **이슈**: Header/네비게이션 구조가 변경되었으나 테스트가 이전 구조를 기대
- **실패 테스트**:
  - "renders main navigation links"
  - "renders category navigation"
  - "shows mega menu on hover"
- **우선순위**: 중간

#### F11. ReviewsPage.test.tsx SheetDescription mock 누락 (신규)

- **상태**: 미착수
- **파일**: `src/features/review/components/__tests__/ReviewsPage.test.tsx`
- **이슈**: Sheet 컴포넌트 mock에 `SheetDescription` export 누락으로 1/2 실패
- **우선순위**: 낮음

#### F12. ProductCard.test.tsx 가격 포맷 불일치 (신규)

- **상태**: 미착수
- **파일**: `src/features/product/components/__tests__/ProductCard.test.tsx:43`
- **이슈**: 테스트가 `₩10,000` (단일 문자열)을 기대하지만 실제 렌더링은 `10,000` + `원` 분리
- **우선순위**: 낮음

---

### P1: 데이터 품질 (백엔드 API 응답 부족)

#### D1. 펀딩 API 응답에 organizer/recipient/image 누락 (신규)

- **상태**: 백엔드 확장 필요
- **설명**: `BackendFundingResponse`에 아래 필드 없음
- **영향**:
  - `organizer` — 하드코딩 `"Organizer"` (실제 주최자 이름 안 보임)
  - `recipient` — 하드코딩 `"Recipient"` (실제 수신자 이름 안 보임)
  - `imageUrl` — 전부 `/images/placeholder-product.svg`
  - `participantCount` — 고정 `0`
  - `createdAt` — 빈 문자열
- **관련 코드**: `src/lib/api/fundings.ts:96-127` (`mapBackendFunding`)
- **우선순위**: 높음 (펀딩 상세 페이지 UX 직접 영향)

#### D2. 위시리스트 API v1/v2 혼용 + 상품 정보 미반환 (신규)

- **상태**: 리팩토링 또는 백엔드 확인 필요
- **설명**:
  - `getMyWishlist()`: v1 엔드포인트 2개 동시 호출 (`/api/wishlist/me` + `/api/wishlist/items/me`)
  - 위시리스트 아이템에 상품 정보 없음 → `Product ${productId}` placeholder
  - `searchPublicWishlists()`, `getPublicWishlist()`: v2 엔드포인트 사용
- **관련 코드**: `src/lib/api/wishlists.ts:43-83`
- **우선순위**: 중간

---

### P2: 기능 구현 (Low Priority / 백엔드 의존)

#### C1. 친구 관계 기능 구현

- **상태**: API 함수 존재 (`getMemberFriends()`), 백엔드 동작 확인 필요
- **설명**: 친구 추가/삭제/목록 기능
- **프론트 현황**: `src/lib/api/members.ts`에 `getMemberFriends()` 구현됨
- **선행 조건**: 백엔드에서 친구 관계 API 동작 여부 확인 필요
- **프론트 영향**: 홈 화면 "친구들의 위시리스트" 섹션, 마이페이지 "친구 관리" 메뉴

#### C2. 전체 위시리스트/회원 목록 탐색

- **상태**: 부분 구현 (ID 직접 입력 방식)
- **설명**: 위시리스트 탐색 페이지 (`/explore`)에서 실제 회원 검색/목록 API 필요
- **프론트 현황**: `searchPublicWishlists(nickname)` API 함수 존재, UI 연결 확인 필요
- **선행 조건**: 백엔드에서 회원 검색/공개 위시리스트 목록 API 제공 필요

#### C3. 상품 이미지 URL 실제 적용

- **상태**: placeholder 사용 중
- **설명**: 백엔드 `BackendProduct`에 imageUrl 필드 없음 → 전부 placeholder
- **영향 범위**: 상품 목록, 상품 상세, 펀딩 카드, 장바구니 아이템 전체
- **선행 조건**: 백엔드 상품 스키마에 이미지 필드 추가, `next.config.ts` 도메인 설정
- **관련 코드**: `src/lib/api/products.ts:41`, `src/lib/api/fundings.ts:104`, `src/lib/api/cart.ts:73`

---

### P2: 와이어프레임 대비 미완성 항목

#### E1. 홈 화면 - 인기 상품 섹션

- **상태**: API fallback 존재, UI만 추가하면 됨
- **설명**: 와이어프레임에 "인기 상품" 2-column 그리드 존재
- **프론트 현황**: `getPopularProducts()` 이미 최신순 fallback으로 구현됨 (`src/lib/api/products.ts:116`)
- **남은 작업**: 홈 페이지에 인기 상품 섹션 UI 컴포넌트 추가
- **참조**: `docs/02-wireframes.md` 3.1절

#### ~~E2. 펀딩 참여 바텀시트 상세 구현~~ ✅

- **상태**: 완료 (2026-02-10)
- **설명**: 금액 입력, 퀵 버튼, 지갑 잔액 표시, 장바구니 담기/바로 결제 분기
- **구현 내용**: ParticipateModal에 상품 요약 카드(이미지+이름+수신자), 지갑 잔액 표시, 듀얼 CTA(장바구니/바로결제) 추가
- **참조**: `docs/02-wireframes.md` 6.3절, AmountInput 컴포넌트 명세 (2.7절)

#### E3. 지갑 충전 - Toss PG SDK 실제 연동

- **상태**: 프론트 준비 완료, A5와 동일 (수정 금지 영역 확인 필요)
- **설명**: 충전 금액 선택 UI + Toss SDK 호출 + 결과 콜백 처리
- **프론트 현황**: `useTossPayments` 훅 7/7 통과, charge 페이지 존재
- **참조**: A5 작업과 연관, `docs/02-wireframes.md` 9.2절

#### ~~E4. 결제 완료 화면 상세~~ ⚠️

- **상태**: 완료 (2026-02-10)
- **설명**: 성공 애니메이션, 참여 결과(진행률 변화), 상세 결제 정보
- **참조**: `docs/02-wireframes.md` 8.3절
- **구현 내용**:
  - 1.5초 처리 중 로딩 (멱등성 DB 커밋 대기)
  - 와이어프레임 8.3: subtitle, 결제수단/일시, 펀딩 목록, X 닫기 버튼
  - tw-animate-css 진입 애니메이션 (staggered)
  - useOrder retry 3회 (exponential backoff)
  - AppShell headerRight prop 추가
- **미구현**: 펀딩 진행률 변화 표시 (78% -> 93%) — OrderDetail 응답에 진행률 데이터 없음, 백엔드 확장 필요

#### E5. 위시리스트 공개 설정 바텀시트

- **상태**: API 함수 존재, UI만 추가하면 됨
- **설명**: 전체 공개/친구만/비공개 선택 바텀시트
- **프론트 현황**: `updateWishlistVisibility()` API 함수 구현됨 (`src/lib/api/wishlists.ts:101`)
- **남은 작업**: 위시리스트 페이지에 설정 바텀시트 UI 컴포넌트 추가
- **백엔드 API**: `PATCH /api/wishlist/me/settings` (`visibility`: PUBLIC | PRIVATE | FRIENDS_ONLY)
- **참조**: `docs/02-wireframes.md` 4.3절

---

## 완료 (Done)

### 2026-02-10

- [x] E2: ParticipateModal 상품 요약/지갑 잔액/듀얼 CTA 추가
- [x] ⚠️ E4: 결제 완료 화면 상세 (처리 중 로딩 + 와이어프레임 8.3 스펙 + 애니메이션) — 진행률 변화 미구현 (백엔드 의존)
- [x] AppShell headerRight prop 추가, Header rightAction 독립 렌더링 수정
- [x] useOrder retry 3회 + exponential backoff 추가
- [x] 체크아웃 페이지 toast.success 제거 (완료 페이지가 피드백 담당)

### 2026-02-08

- [x] 홈 화면 TrendingFundingsSection 제거 (API 미존재, 코드 정리)
- [x] 프로필 지갑 잔액 실 API 연동 (`useWallet` 적용, 하드코딩 제거)
- [x] 내 위시리스트 셀프 펀딩 기능 제거 (서비스 정책: 셀프 펀딩 없음)
- [x] 친구 위시리스트(`/wishlist/[userId]`)에 CreateFundingModal 연결
- [x] 펀딩 상세 참여 후 장바구니 리다이렉트 (`onSuccess → router.push('/cart')`)
- [x] `placeOrder` API에서 Money VO 직렬화 수정 (`amount: N` → `amount: { amount: N }`)
- [x] ⚠️ A7: `POST /api/v2/orders` 400 에러 발견 — 백엔드 `-parameters` 플래그 이슈 (백엔드 전달 완료)

### 2026-02-07 (2차)

- [x] F4: `as any` 잔여 4건 제거 (useWishlistItem, useHomeData)
- [x] F5: 테스트 TS 에러 수정 (Wallet 타입, Vitest import, payment 타입)
- [x] F6: 디버그용 console.log 2건 제거
- [x] F8: deprecated `updateMember` 삭제, `updateMe`로 전환

### 2026-02-07 (1차)

- [x] A1: 상품 상세 조회 API 404 해결
- [x] A2: 장바구니 API 엔드포인트 정렬 및 RsData 이중 언래핑 수정
- [x] A4: 주문 API 타입 백엔드 스펙 정렬 (4개 enum, RsData 수정, 필드명 변경)
- [x] B1: 장바구니/지갑 모바일 반응형 최적화
- [x] B2: 장바구니/지갑 Skeleton UI 로딩 상태 개선
- [x] B3: 장바구니/결제 페이지 InlineError 에러 상태 추가
- [x] F1: `as any` 타입 캐스팅 제거 (FundingCard, UserHome, explore)
- [x] F2: explore 페이지 recipient 수동 재구성 제거
- [x] F3: 페이지네이션 매핑 유틸 통합 (`pagination.ts`)
- [x] Q1: RedirectToProfile `setTimeout` 제거, 직접 `router.replace`
- [x] Q2: 프로필 페이지 InlineError 에러 상태 추가
- [x] Q3: Mock 핸들러 지갑 거래내역 응답 형식 동기화
- [x] Q4: 레거시 `createOrder` / `useCreateOrder` 삭제

### 2026-02-03

- [x] 상품 상세 페이지 29cm 스타일 리뉴얼
- [x] 장바구니 담기, 바로 구매하기 버튼 구현
- [x] 찜하기/공유하기 기능 추가
- [x] 백엔드 상품 API 연동 (`/api/products/search`)
- [x] 친구 위시리스트 페이지 UI 개선
- [x] 위시리스트 탐색 페이지 (`/explore`) 추가
- [x] MSW 비활성화 옵션 추가
- [x] Auth0 세션 구조 문서화

### 2026-01-28 (Phase 1~13 완료)

- [x] Foundation & Types (OpenAPI 기반 타입 정의)
- [x] Authentication (Auth0 SDK 통합)
- [x] TanStack Query Integration
- [x] Home Page
- [x] Product Search & Detail
- [x] Wishlist
- [x] Funding Flow
- [x] Cart & Checkout
- [x] Wallet
- [x] My Page
- [x] Error Handling & Polish
- [x] Testing (12개 테스트 케이스)
- [x] Performance & Optimization (SEO, PWA)

---

## 인증 & 보안 (별도 관리)

- [ ] **Auth0 세션 유지 기간 짧게 변경** - 현재 7일에서 더 짧은 기간으로 조정
  - Auth0 Dashboard에서 Absolute Lifetime, Inactivity Timeout 설정 변경
  - 참고: `/docs/auth0-session-guide.md`
  - 주의: 프론트엔드 코드 변경이 아닌 Dashboard 설정 변경

---

## 참고 자료

| 자료 | 위치 |
|------|------|
| 백엔드 Swagger | `http://localhost:8080/swagger-ui/index.html` |
| 백엔드 API 스펙 (최신) | `docs/api-docs.json` (OpenAPI 3.1) |
| 프론트 API 스펙 (초기 설계) | `docs/03-api-spec.yaml` (OpenAPI 3.0) |
| 와이어프레임 & 디자인 시스템 | `docs/02-wireframes.md` |
| Auth0 세션 가이드 | `docs/auth0-session-guide.md` |
| 프론트 구현 인수인계 | `docs/workthrough/260128-GIFTIFY-01-frontend-implementation-summary.md` |
| Auth0 통합 기록 | `docs/workthrough/260131-AUTH-01-auth0-integration-and-session-optimization.md` |
| Auth0 Dashboard | `https://manage.auth0.com/` |

---

## 백엔드 요청 명세

### A7. `POST /api/v2/orders` Java record 파라미터 이름 인식 실패

**발견 일자**: 2026-02-08
**심각도**: Critical (결제 플로우 전체 차단)
**리포터**: 프론트엔드팀

#### 재현 과정

1. 친구 위시리스트에서 펀딩 개설 (CreateFundingModal → 장바구니 담기)
2. 장바구니 → 체크아웃 → "결제하기" 클릭
3. `POST /api/v2/orders` 호출 시 400 Bad Request

#### 요청 Body (프론트엔드에서 전송)

```json
{
  "items": [
    {
      "wishlistItemId": 2,
      "receiverId": 0,
      "amount": { "amount": 5000 },
      "orderItemType": "FUNDING_GIFT"
    }
  ],
  "method": "DEPOSIT"
}
```

#### 에러 응답

```json
{
  "result": "FAIL",
  "data": null,
  "message": "Name for argument of type [java.lang.Long] not specified, and parameter name information not available via reflection. Ensure that the compiler uses the '-parameters' flag.",
  "errorCode": "GLOBAL_002"
}
```

#### 백엔드 로그

```
2026-02-08 22:20:18.703 WARN [http-nio-8080-exec-4]
g.s.web.handler.GlobalExceptionHandler:
[Global] 잘못된 인자: Name for argument of type [java.lang.Long]
not specified, and parameter name information not available via reflection.
Ensure that the compiler uses the '-parameters' flag.
```

#### 원인 분석

Java record DTO (`PlaceOrderRequest`, `PlaceOrderItemRequest`)의 canonical constructor
파라미터 이름이 컴파일된 바이트코드에 보존되지 않아 Jackson/Spring이 파라미터를
이름으로 매핑하지 못합니다.

관련 클래스:
- `app.giftify.orderDemo.adapter.inbound.web.dto.request.PlaceOrderRequest`
- `app.giftify.orderDemo.adapter.inbound.web.dto.request.PlaceOrderItemRequest`
- `app.giftify.shared.domain.vo.Money`

#### 수정 방안

**방안 A (권장): 빌드 스크립트에 `-parameters` 추가**

모든 모듈의 `build.gradle` (또는 루트 `build.gradle`의 `subprojects` 블록)에:

```groovy
tasks.withType(JavaCompile).configureEach {
    options.compilerArgs.add('-parameters')
}
```

Spring Boot 3.x는 `spring-boot-starter-parent`를 사용하면 자동 설정되지만,
멀티모듈 프로젝트에서 하위 모듈(bc/core, bc/shared 등)에 누락될 수 있습니다.

**방안 B (대안): DTO에 Jackson 어노테이션 추가**

```java
public record PlaceOrderItemRequest(
    @JsonProperty("wishlistItemId") Long wishlistItemId,
    @JsonProperty("receiverId") Long receiverId,
    @JsonProperty("amount") Money amount,
    @JsonProperty("orderItemType") OrderItemType orderItemType
) {}
```

방안 A가 전역 해결이므로 권장합니다.

#### 참고: Money VO 직렬화 (프론트에서 이미 수정 완료)

이전에 `amount: 10000` (plain number)으로 전송하여 500 에러가 발생했던 이슈는
프론트엔드에서 `amount: { amount: 10000 }` 형태로 변환하여 해결했습니다.
(`src/lib/api/orders.ts` - `placeOrder` 함수)

---

## 수정 금지 영역

아래 영역은 읽기만 가능하며, 수정 시 담당자에게 요청:

- `.env*` 파일들
- `src/lib/auth/` - 인증 관련 코드
- `src/features/auth/` - 인증 기능
- `src/features/payment/` - 결제 관련 코드

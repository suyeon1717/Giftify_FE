# 프로젝트 백로그

> 최종 수정: 2026-02-07 (2차 업데이트)
> 분류 기준: 프론트엔드 관점, 우선순위(P0~P2) + 백엔드 의존성 명시

---

## 할 일 (To Do)

### P0: 백엔드 연동 (High Priority)

MSW 목 데이터 기반에서 실제 백엔드 API로 전환하는 작업입니다.
현재 13개 Phase 구현이 완료되어 페이지/컴포넌트는 존재하나, 대부분 MSW 기반으로 동작 중입니다.

#### A2-1. 장바구니 CRUD API 추가 요청 (백엔드)

- **상태**: 백엔드팀 요청 필요
- **설명**: 장바구니 아이템 수정/삭제/비우기 API가 백엔드에 없음
- **필요 API**:
  - `PATCH /api/v2/carts/items/{itemId}` - 아이템 금액 수정
  - `DELETE /api/v2/carts/items/{itemId}` - 아이템 삭제
  - `DELETE /api/v2/carts` - 장바구니 비우기
- **프론트 현황**: 해당 함수들이 `throw Error`로 구현되어, 장바구니 페이지에서 금액 변경/삭제 시 에러 발생
- **프론트 파일**: `src/lib/api/cart.ts` (`updateCartItem`, `removeCartItem`, `clearCart`)

#### A3. 펀딩 생성 API 연동

- **상태**: 미해결 (백엔드 API 존재 여부 확인 필요)
- **설명**: 친구 위시리스트에서 펀딩 개설하는 기능
- **백엔드 API**: 펀딩 생성 엔드포인트가 현재 Swagger에 미노출
  - 기존 엔드포인트: `GET /api/fundings/{id}`, `/accept`, `/refuse`, `/expire`, `/close`
  - `POST /api/fundings` (생성)는 스펙에서 미확인 -> **백엔드팀 확인 필요**
- **프론트 파일**: `src/features/funding/api/`, 펀딩 생성 모달 컴포넌트
- **선행 조건**: 백엔드에서 펀딩 생성 API 제공 필요

#### A5. 결제(Payment) - Toss PG SDK 연동

- **상태**: 미착수
- **설명**: 예치금 충전을 위한 Toss PG 결제 연동
- **백엔드 API**:
  - `POST /api/v2/payments/charge` - 결제 생성 (`PaymentChargeRequest` -> `PaymentChargeResponse`)
  - `POST /api/v2/payments/confirm` - 결제 승인 (`PaymentConfirmRequest` -> `PaymentConfirmResponse`)
- **프론트 파일**: `src/features/payment/`, `src/app/wallet/charge/`
- **연동 플로우**:
  1. `POST /api/v2/payments/charge`로 Payment 레코드 생성
  2. 응답의 `orderId`, `amount`로 프론트에서 Toss SDK 호출
  3. Toss 결제 완료 후 `POST /api/v2/payments/confirm` 호출
- **주의**: `src/features/payment/`는 수정 금지 영역 - 담당자 확인 필요

#### A6. 지갑(Wallet) API 연동 검증

- **상태**: 미확인
- **설명**: 지갑 잔액 조회, 거래 내역 조회, 출금 API 실제 연동
- **백엔드 API**:
  - `GET /api/v2/wallet/balance` - 잔액 조회 (`WalletBalanceResponse`)
  - `GET /api/v2/wallet/history` - 거래 내역 조회 (`WalletHistoryResponse`, 페이징)
  - `POST /api/v2/wallet/withdraw` - 출금 요청 (`WithdrawWalletRequest`)
- **프론트 파일**: `src/features/wallet/`, `src/app/wallet/`
- **확인 사항**:
  - `WalletHistoryResponse` 단일 객체 vs 배열 응답 확인 필요
  - 거래 유형 필터: `CHARGE` | `WITHDRAW` | `PAYMENT`

---

### P1: 코드 품질 (프론트 자체 해결 가능)

#### F4. 남은 `as any` 타입 캐스팅 제거 (4건)

- **상태**: 미착수
- **파일 및 위치**:
  - `src/features/wishlist/hooks/useWishlistItem.ts:18,21` - queryClient 캐시 데이터에 `as any` 사용
  - `src/features/home/hooks/useHomeData.ts:39` - `sort: 'price,desc' as any`
  - `src/features/home/hooks/useHomeData.ts:72` - `member: user as any`
- **해결 방향**: 캐시 데이터에 적절한 제네릭 타입 지정, sort/member 타입 정의 추가

#### F5. 테스트 파일 TypeScript 에러 수정 (8건)

- **상태**: 미착수
- **파일 및 위치**:
  - `src/features/payment/components/__tests__/CheckoutPage.test.tsx:41` - Wallet 타입에 `id` 속성 없음 (`walletId` 사용해야 함)
  - `src/features/wallet/components/__tests__/WalletPage.test.tsx:42` - 동일 Wallet 타입 문제
  - `src/features/wallet/hooks/__tests__/useTossPayments.test.ts` - Vitest 글로벌 타입 누락 (`vi`, `describe`, `it`, `expect`)
  - `src/lib/api/__tests__/payment.test.ts` - `orderId` 누락, 잘못된 `idempotencyKey` 속성
- **원인**: Wallet 타입 정의 변경 후 테스트 미동기화, tsconfig 테스트 설정 누락
- **주의**: `src/features/payment/` 내 테스트는 수정 금지 영역 확인 필요

#### F6. 디버그용 console.log 정리

- **상태**: 미착수
- **제거 대상** (debug용):
  - `src/app/auth/complete-signup/page.tsx:170` - `console.log('Member already exists...')`
  - `src/app/fundings/[id]/page.tsx:165` - `console.log('Participation Success')`
- **유지 대상** (에러 로깅, 정상):
  - `console.error(...)` 호출들은 프로덕션 에러 추적용으로 유지

#### F7. 결제 페이지 TODO 해결 (백엔드 협의 필요)

- **상태**: 백엔드 협의 필요
- **파일**: `src/app/checkout/page.tsx`
- **이슈**:
  - `:31-32` - Cart 응답에서 `wishlistItemId` 제공 여부 백엔드 협의 필요
  - `:37-38` - Cart 아이템에 `receiverId` 포함 필요 (현재 임시값 `0`)
- **영향**: 주문 생성 시 정확한 `wishlistItemId`와 `receiverId`가 없으면 결제 플로우 불완전

#### F8. deprecated `updateMember()` 함수 정리

- **상태**: 미착수
- **파일**: `src/lib/api/members.ts`
- **설명**: `updateMember()`가 `@deprecated` 표시됨, `updateMe()`로 대체 완료 여부 확인 후 삭제

---

### P2: 기능 구현 (Low Priority / 백엔드 의존)

#### C1. 친구 관계 기능 구현

- **상태**: 백엔드 API 없음
- **설명**: 친구 추가/삭제/목록 기능
- **선행 조건**: 백엔드에서 친구 관계 API 제공 필요
- **프론트 영향**: 홈 화면 "친구들의 위시리스트" 섹션, 마이페이지 "친구 관리" 메뉴

#### C2. 전체 위시리스트/회원 목록 탐색

- **상태**: 부분 구현 (ID 직접 입력 방식)
- **설명**: 위시리스트 탐색 페이지 (`/explore`)에서 실제 회원 검색/목록 API 필요
- **선행 조건**: 백엔드에서 회원 검색/공개 위시리스트 목록 API 제공 필요

#### C3. 상품 이미지 URL 실제 적용

- **상태**: placeholder 사용 중
- **설명**: 현재 `picsum.photos` 사용, 백엔드에서 실제 이미지 URL 관리 필요
- **선행 조건**: 백엔드 상품 스키마에 이미지 필드 추가, `next.config.ts` 도메인 설정

---

### P2: 와이어프레임 대비 미완성 항목

#### E1. 홈 화면 - 인기 상품 섹션

- **설명**: 와이어프레임에 "인기 상품" 2-column 그리드 존재
- **백엔드 API**: 인기 상품 조회 API 미존재 (`/api/products/popular` 없음)
- **참조**: `docs/02-wireframes.md` 3.1절

#### E2. 펀딩 참여 바텀시트 상세 구현

- **설명**: 금액 입력, 퀵 버튼, 지갑 잔액 표시, 장바구니 담기/바로 결제 분기
- **참조**: `docs/02-wireframes.md` 6.3절, AmountInput 컴포넌트 명세 (2.7절)

#### E3. 지갑 충전 - Toss PG SDK 실제 연동

- **설명**: 충전 금액 선택 UI + Toss SDK 호출 + 결과 콜백 처리
- **참조**: A5 작업과 연관, `docs/02-wireframes.md` 9.2절

#### E4. 결제 완료 화면 상세

- **설명**: 성공 애니메이션, 참여 결과(진행률 변화), 상세 결제 정보
- **참조**: `docs/02-wireframes.md` 8.3절

#### E5. 위시리스트 공개 설정 바텀시트

- **설명**: 전체 공개/친구만/비공개 선택 바텀시트
- **백엔드 API**: `PATCH /api/wishlist/me/settings` (`visibility`: PUBLIC | PRIVATE | FRIENDS_ONLY)
- **참조**: `docs/02-wireframes.md` 4.3절

---

## 완료 (Done)

### 2026-02-07 (2차)

- [x] F1: `as any` 타입 캐스팅 제거 (FundingCard, UserHome, explore)
- [x] F2: explore 페이지 recipient 수동 재구성 제거
- [x] F3: 페이지네이션 매핑 유틸 통합 (`pagination.ts`)
- [x] Q1: RedirectToProfile `setTimeout` 제거, 직접 `router.replace`
- [x] Q2: 프로필 페이지 InlineError 에러 상태 추가
- [x] Q3: Mock 핸들러 지갑 거래내역 응답 형식 동기화
- [x] Q4: 레거시 `createOrder` / `useCreateOrder` 삭제

### 2026-02-07 (1차)

- [x] A1: 상품 상세 조회 API 404 해결
- [x] A2: 장바구니 API 엔드포인트 정렬 및 RsData 이중 언래핑 수정
- [x] A4: 주문 API 타입 백엔드 스펙 정렬 (4개 enum, RsData 수정, 필드명 변경)
- [x] B1: 장바구니/지갑 모바일 반응형 최적화
- [x] B2: 장바구니/지갑 Skeleton UI 로딩 상태 개선
- [x] B3: 장바구니/결제 페이지 InlineError 에러 상태 추가

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

## 수정 금지 영역

아래 영역은 읽기만 가능하며, 수정 시 담당자에게 요청:

- `.env*` 파일들
- `src/lib/auth/` - 인증 관련 코드
- `src/features/auth/` - 인증 기능
- `src/features/payment/` - 결제 관련 코드

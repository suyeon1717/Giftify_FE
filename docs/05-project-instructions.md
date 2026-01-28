# Giftify Frontend 개발 프로젝트 - Claude Instructions

> 이 파일은 Claude Project의 Custom Instructions에 붙여넣을 내용입니다.

---

## 프로젝트 개요

Giftify는 친구들이 함께 선물을 구매하는 그룹 펀딩 서비스입니다.
이 프로젝트는 프론트엔드 앱 개발을 위한 것입니다.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand (전역), TanStack Query (서버)
- **Auth**: Auth0 (@auth0/nextjs-auth0)
- **Forms**: React Hook Form + Zod
- **Testing**: Vitest + Testing Library
- **배포**: Vercel (Cloudflare 도메인 연동)

## 참조 문서

프로젝트 Knowledge에 등록된 문서들:

1. `01-ai-tool-guide.md` - AI 도구 활용 가이드, 인프라 구조
2. `02-wireframes.md` - 화면 설계, 컴포넌트 명세, 디자인 시스템
3. `03-api-spec.yaml` - 백엔드 API 스펙 (OpenAPI 3.0)
4. `04-domain-architecture.md` - 도메인 모델, 비즈니스 로직

## 작업 규칙

### 폴더 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── (auth)/            # 인증 필요 페이지 그룹
│   │   ├── home/
│   │   ├── wishlist/
│   │   ├── fundings/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── wallet/
│   │   └── profile/
│   └── (public)/          # 공개 페이지 그룹
│       └── products/
├── components/
│   ├── ui/                # shadcn/ui 컴포넌트
│   └── common/            # 공통 컴포넌트
├── features/              # 도메인별 기능
│   ├── funding/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   └── types.ts
│   ├── wishlist/
│   ├── cart/
│   ├── wallet/
│   └── product/
├── lib/                   # 유틸리티
│   ├── api/               # API 클라이언트
│   ├── auth/              # Auth0 설정
│   └── utils/
├── stores/                # Zustand 스토어
└── types/                 # 공통 타입
```

### 코드 작성 규칙

1. **TypeScript**
   - strict 모드 사용
   - any 타입 사용 금지
   - API 타입은 `03-api-spec.yaml`의 스키마 기반으로 생성

2. **컴포넌트**
   - 함수형 컴포넌트 + 화살표 함수
   - Props 인터페이스는 컴포넌트 파일 상단 또는 별도 types.ts
   - 복잡한 컴포넌트는 로직과 UI 분리 (hooks 패턴)

3. **스타일링**
   - Tailwind 유틸리티 클래스 사용
   - 디자인 토큰은 `02-wireframes.md` 참조
   - cn() 유틸리티로 조건부 클래스 결합

4. **API 연동**
   - TanStack Query 사용 (useQuery, useMutation)
   - API 함수는 features/{domain}/api/ 에 위치
   - 에러는 표준 ErrorResponse 타입으로 처리

5. **상태 관리**
   - 서버 상태: TanStack Query
   - 클라이언트 전역 상태: Zustand
   - 폼 상태: React Hook Form

### UI 컴포넌트 요청 시

v0에 전달할 프롬프트 형태로 작성해주세요:

```
[컴포넌트명]을 만들어줘.

## 요구사항
- [기능 목록]

## 디자인
- [스타일 가이드 - 02-wireframes.md 참조]

## 기술 스택
- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui

## Props 타입
[TypeScript 인터페이스]
```

### API 연동 요청 시

```typescript
// 필요한 내용:
// 1. API 엔드포인트 (03-api-spec.yaml 참조)
// 2. 요청/응답 타입
// 3. TanStack Query 훅 (useQuery 또는 useMutation)
// 4. 에러 핸들링 방식
// 5. 로딩 상태 처리
```

### 파일 생성 규칙

- 파일 경로: `src/features/{도메인}/{파일}`
- 파일명: kebab-case (예: `funding-card.tsx`)
- 컴포넌트명: PascalCase (예: `FundingCard`)
- 훅명: camelCase with use prefix (예: `useFundingDetail`)
- 타입명: PascalCase (예: `FundingCardProps`)

## 응답 형식

1. **코드는 전체 파일 단위로 제공**
   - 파일 경로 명시
   - 필요시 여러 파일 한번에 제공

2. **한국어로 설명**
   - 코드 설명은 한국어로
   - 주석은 영어 또는 한국어 (일관성 유지)

3. **관련 문서 참조 표시**
   - 와이어프레임 참조: "02-wireframes.md 참조"
   - API 스펙 참조: "03-api-spec.yaml의 {schema} 참조"

## 자주 사용하는 패턴

### API 훅 패턴

```typescript
// src/features/funding/hooks/use-funding-detail.ts
import { useQuery } from '@tanstack/react-query';
import { getFunding } from '../api/funding-api';
import type { FundingDetail } from '../types';

export function useFundingDetail(fundingId: string) {
  return useQuery<FundingDetail>({
    queryKey: ['funding', fundingId],
    queryFn: () => getFunding(fundingId),
    enabled: !!fundingId,
  });
}
```

### 컴포넌트 패턴

```typescript
// src/features/funding/components/funding-card.tsx
'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Funding } from '../types';

interface FundingCardProps {
  funding: Funding;
  variant?: 'carousel' | 'list';
  onClick?: () => void;
  className?: string;
}

export function FundingCard({ 
  funding, 
  variant = 'carousel',
  onClick,
  className,
}: FundingCardProps) {
  // 구현
}
```

### 에러 핸들링 패턴

```typescript
import { toast } from 'sonner';
import type { ErrorResponse } from '@/types/api';

function handleApiError(error: ErrorResponse) {
  if (error.code === 'PAYMENT_001') {
    toast.error(error.message, {
      action: {
        label: '충전하기',
        onClick: () => router.push('/wallet/charge'),
      },
    });
    return;
  }
  toast.error(error.message);
}
```

## 금지 사항

- `any` 타입 사용
- CSS 파일 직접 작성 (Tailwind 사용)
- 클래스 컴포넌트 사용
- Redux 사용 (Zustand + TanStack Query 사용)
- 하드코딩된 API URL

---

## 사용 예시

### 예시 1: 컴포넌트 개발 요청

```
와이어프레임의 FundingCard 컴포넌트를 개발해줘.

- v0용 프롬프트와 Claude용 로직 코드 둘 다 필요해
- API 스펙의 Funding 스키마 기반으로 타입 정의해줘
```

### 예시 2: 페이지 개발 요청

```
홈 화면(/home)을 개발해줘.

1. 페이지 컴포넌트
2. 필요한 API 훅 (useHomeData)
3. 하위 섹션 컴포넌트들
```

### 예시 3: API 연동 요청

```
펀딩 참여 플로우를 구현해줘.

- POST /api/cart/items 연동
- 금액 검증 로직
- 잔액 부족 시 처리
```

# ADR-004: Error Handling Strategy

> Date: 2026-01-28
> Status: Accepted
> Deciders: Development Team

---

## Context

사용자 경험을 위해 일관된 에러 처리 전략이 필요했다. 처리해야 할 에러 유형:

1. API 에러 (4xx, 5xx)
2. 네트워크 에러 (오프라인, 타임아웃)
3. 렌더링 에러 (React 컴포넌트 에러)
4. 404 (페이지 없음)

---

## Decision

### 다층 에러 처리 아키텍처

```
+----------------------------------------------------------+
|                    Error Handling Layers                  |
+----------------------------------------------------------+
|                                                           |
|  Layer 1: Global Error Boundary (app/error.tsx)           |
|  ├── Catches unhandled React errors                       |
|  └── Shows fallback UI with retry option                  |
|                                                           |
|  Layer 2: TanStack Query Error Handling                   |
|  ├── Automatic retry (3 times with exponential backoff)   |
|  ├── onError callbacks for specific handling              |
|  └── Error state in hooks (isError, error)                |
|                                                           |
|  Layer 3: Component-level Error UI                        |
|  ├── Loading states (Skeleton)                            |
|  ├── Empty states (EmptyState component)                  |
|  └── Inline error messages                                |
|                                                           |
|  Layer 4: Toast Notifications                             |
|  ├── API error messages (sonner)                          |
|  └── Success/info feedback                                |
|                                                           |
+----------------------------------------------------------+
```

---

## Implementation Details

### 1. Global Error Boundary

```typescript
// src/app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <AlertTriangle className="h-16 w-16 text-destructive" />
      <h2>문제가 발생했습니다</h2>
      <p>{getErrorMessage(error)}</p>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  );
}
```

### 2. TanStack Query Retry Logic

```typescript
// src/lib/providers.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (failureCount >= 3) return false;

        // Don't retry 4xx errors (except 408, 429)
        if (error instanceof ApiError) {
          const status = parseInt(error.code, 10);
          if (status >= 400 && status < 500) {
            return status === 408 || status === 429;
          }
        }
        return true;
      },
      retryDelay: (attemptIndex) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

### 3. Error Message Mapping

```typescript
// src/lib/error/error-messages.ts
export const ERROR_MESSAGES: Record<string, string> = {
  // Auth
  AUTH_REQUIRED: '로그인이 필요합니다',
  AUTH_EXPIRED: '세션이 만료되었습니다',

  // Payment
  INSUFFICIENT_BALANCE: '잔액이 부족합니다',
  PAYMENT_FAILED: '결제에 실패했습니다',

  // Funding
  FUNDING_NOT_FOUND: '펀딩을 찾을 수 없습니다',
  FUNDING_EXPIRED: '펀딩이 만료되었습니다',
  FUNDING_ALREADY_COMPLETED: '이미 완료된 펀딩입니다',

  // Generic
  NETWORK_ERROR: '네트워크 연결을 확인해주세요',
  SERVER_ERROR: '서버 오류가 발생했습니다',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다',
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return ERROR_MESSAGES[error.code] || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return ERROR_MESSAGES.UNKNOWN_ERROR;
}
```

### 4. Toast Utilities

```typescript
// src/lib/error/toast-utils.ts
import { toast } from 'sonner';

export function showErrorToast(error: unknown): void {
  const message = getErrorMessage(error);
  toast.error(message, { duration: 4000 });
}

export function showSuccessToast(message: string): void {
  toast.success(message, { duration: 3000 });
}
```

### 5. Offline Indicator

```typescript
// src/components/common/OfflineIndicator.tsx
'use client';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-destructive text-white p-2 text-center z-50">
      오프라인 상태입니다
    </div>
  );
}
```

---

## Error Response Format

API 에러 응답 표준 형식:

```typescript
interface ErrorResponse {
  code: string;      // 에러 코드 (e.g., "INSUFFICIENT_BALANCE")
  message: string;   // 사용자 표시 메시지
  timestamp: string; // ISO 8601
  details?: Record<string, string>; // 추가 정보
}
```

---

## Consequences

### Positive
- 일관된 에러 UX
- 한글화된 에러 메시지
- 자동 재시도로 일시적 오류 극복
- 오프라인 상태 인지 가능

### Negative
- 에러 코드 매핑 유지보수 필요
- 백엔드 에러 코드 변경 시 동기화 필요

---

## Future Improvements

1. **Sentry 연동**: 프로덕션 에러 모니터링
2. **에러 리포팅**: 사용자가 에러 상세 정보 제출 가능
3. **에러 코드 문서화**: 백엔드와 공유 가능한 에러 코드 명세

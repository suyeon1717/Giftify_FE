import { renderHook, waitFor, act } from '@testing-library/react';

import { useTossPayments } from '../useTossPayments';

// Mock environment variable
const mockClientKey = 'test_ck_mock_client_key';

// Mock TossPayments SDK
const mockRequestPayment = vi.fn();
const mockPaymentInstance = {
  requestPayment: mockRequestPayment,
};
const mockTossPayments = vi.fn(() => ({
  payment: vi.fn(() => mockPaymentInstance),
}));

describe('useTossPayments', () => {
  const originalEnv = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY = mockClientKey;

    // Reset window.TossPayments
    (window as any).TossPayments = undefined;

    // 이전 테스트에서 생성된 스크립트 태그 제거
    document.querySelectorAll('script[src*="tosspayments"]').forEach((el) => el.remove());
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY = originalEnv;
    // 테스트 후 스크립트 태그 정리
    document.querySelectorAll('script[src*="tosspayments"]').forEach((el) => el.remove());
  });

  describe('초기화', () => {
    it('SDK가 로드되기 전에는 isLoading이 true여야 함', () => {
      const { result } = renderHook(() => useTossPayments('test-customer-key'));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isReady).toBe(false);
    });

    it('SDK 로드 후 isReady가 true가 되어야 함', async () => {
      const { result } = renderHook(() => useTossPayments('test-customer-key'));

      // Simulate SDK load
      act(() => {
        (window as any).TossPayments = mockTossPayments;
        // Trigger the script onload
        const script = document.querySelector('script[src*="tosspayments"]');
        if (script) {
          script.dispatchEvent(new Event('load'));
        }
      });

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('환경 변수가 없으면 에러가 발생해야 함', async () => {
      process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY = '';

      const { result } = renderHook(() => useTossPayments('test-customer-key'));

      // Simulate SDK load
      act(() => {
        (window as any).TossPayments = mockTossPayments;
        const script = document.querySelector('script[src*="tosspayments"]');
        if (script) {
          script.dispatchEvent(new Event('load'));
        }
      });

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      expect(result.current.error?.message).toContain('NEXT_PUBLIC_TOSS_CLIENT_KEY');
    });
  });

  describe('requestPayment', () => {
    it('SDK가 준비되지 않은 상태에서 requestPayment 호출 시 에러', async () => {
      // TossPayments가 undefined인 상태에서 테스트
      (window as any).TossPayments = undefined;

      const { result } = renderHook(() => useTossPayments('test-customer-key'));

      // isReady가 false인 상태에서 호출 - paymentInstance가 null이므로 에러 발생
      await expect(
        result.current.requestPayment({
          orderId: 'test-order-id',
          amount: 10000,
        })
      ).rejects.toThrow('Toss Payments SDK가 준비되지 않았습니다.');
    });

    it('SDK가 준비된 상태에서 requestPayment가 정상 호출되어야 함', async () => {
      (window as any).TossPayments = mockTossPayments;
      mockRequestPayment.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useTossPayments('test-customer-key'));

      // SDK 로드 시뮬레이션
      act(() => {
        const script = document.querySelector('script[src*="tosspayments"]');
        if (script) {
          script.dispatchEvent(new Event('load'));
        }
      });

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      // requestPayment 호출
      await act(async () => {
        await result.current.requestPayment({
          orderId: 'CHG-test-order',
          amount: 10000,
          orderName: 'Test Order',
          customerEmail: 'test@example.com',
          customerName: 'Test User',
        });
      });

      expect(mockRequestPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'CARD',
          amount: { currency: 'KRW', value: 10000 },
          orderId: 'CHG-test-order',
          orderName: 'Test Order',
          customerEmail: 'test@example.com',
          customerName: 'Test User',
        })
      );
    });

    it('orderName이 없으면 기본값 사용', async () => {
      (window as any).TossPayments = mockTossPayments;
      mockRequestPayment.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useTossPayments('test-customer-key'));

      act(() => {
        const script = document.querySelector('script[src*="tosspayments"]');
        if (script) {
          script.dispatchEvent(new Event('load'));
        }
      });

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      await act(async () => {
        await result.current.requestPayment({
          orderId: 'CHG-test',
          amount: 5000,
        });
      });

      expect(mockRequestPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          orderName: 'Giftify 캐시 충전',
        })
      );
    });
  });

  describe('customerKey 변경', () => {
    it('customerKey가 변경되면 재초기화되어야 함', async () => {
      (window as any).TossPayments = mockTossPayments;

      const { result, rerender } = renderHook(
        ({ customerKey }) => useTossPayments(customerKey),
        { initialProps: { customerKey: 'customer-1' } }
      );

      act(() => {
        const script = document.querySelector('script[src*="tosspayments"]');
        if (script) {
          script.dispatchEvent(new Event('load'));
        }
      });

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
      });

      // customerKey 변경
      rerender({ customerKey: 'customer-2' });

      // payment 인스턴스가 새 customerKey로 재생성되어야 함
      expect(mockTossPayments).toHaveBeenCalled();
    });
  });
});

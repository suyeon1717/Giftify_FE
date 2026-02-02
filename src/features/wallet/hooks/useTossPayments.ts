import { useState, useEffect, useCallback } from 'react';

// Toss Payments SDK v2 타입 정의
declare global {
  interface Window {
    TossPayments?: (clientKey: string) => TossPaymentsInstance;
  }
}

interface TossPaymentsInstance {
  payment: (options: { customerKey: string }) => TossPaymentMethod;
}

interface TossPaymentMethod {
  requestPayment: (options: TossPaymentOptions) => Promise<void>;
}

// 지원하는 결제 수단
export type PaymentMethod = 'CARD' | 'TRANSFER' | 'VIRTUAL_ACCOUNT' | 'MOBILE_PHONE';

// 간편결제 수단 (easyPay)
export type EasyPayProvider = 'TOSSPAY' | 'KAKAOPAY' | 'SSGPAY' | 'PAYCO';

interface TossPaymentOptions {
  method: PaymentMethod;
  amount: {
    currency: 'KRW';
    value: number;
  };
  orderId: string;
  orderName: string;
  successUrl: string;
  failUrl: string;
  customerEmail?: string;
  customerName?: string;
  card?: {
    useEscrow?: boolean;
    flowMode?: 'DEFAULT' | 'DIRECT';
    easyPay?: EasyPayProvider;
    useCardPoint?: boolean;
    useAppCardOnly?: boolean;
  };
}

interface UseTossPaymentsResult {
  isLoading: boolean;
  isReady: boolean;
  error: Error | null;
  requestPayment: (options: RequestPaymentOptions) => Promise<void>;
}

interface RequestPaymentOptions {
  orderId: string;
  amount: number;
  method?: PaymentMethod;
  easyPay?: EasyPayProvider;
  orderName?: string;
  customerEmail?: string;
  customerName?: string;
}

const TOSS_SDK_URL = 'https://js.tosspayments.com/v2/standard';

/**
 * Toss Payments SDK v2 결제창 훅
 *
 * SDK 결제창 방식 (requestPayment)을 사용합니다.
 * 결제위젯과 달리 사업자등록 없이 테스트 clientKey로 사용 가능합니다.
 *
 * @param customerKey - 회원 식별자 (memberId 등)
 */
export function useTossPayments(customerKey: string): UseTossPaymentsResult {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [paymentInstance, setPaymentInstance] = useState<TossPaymentMethod | null>(null);

  // Payment 인스턴스 초기화 함수
  const doInitialize = useCallback(() => {
    try {
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

      if (!clientKey) {
        throw new Error('NEXT_PUBLIC_TOSS_CLIENT_KEY 환경 변수가 설정되지 않았습니다.');
      }

      if (!window.TossPayments) {
        throw new Error('Toss Payments SDK가 로드되지 않았습니다.');
      }

      const tossPayments = window.TossPayments(clientKey);
      const payment = tossPayments.payment({ customerKey });

      setPaymentInstance(payment);
      setIsReady(true);
      setIsLoading(false);
    } catch (err) {
      console.error('[TossPayments] initialization error:', err);
      setError(err instanceof Error ? err : new Error('SDK 초기화 실패'));
      setIsLoading(false);
    }
  }, [customerKey]);

  // SDK 스크립트 로드
  useEffect(() => {
    // SDK가 이미 로드되어 있으면 바로 초기화
    if (window.TossPayments) {
      doInitialize();
      return;
    }

    const existingScript = document.querySelector(`script[src="${TOSS_SDK_URL}"]`);

    if (existingScript) {
      // 스크립트 태그는 있지만 아직 로드 중인 경우 - 로드 완료를 기다림
      const checkLoaded = setInterval(() => {
        if (window.TossPayments) {
          clearInterval(checkLoaded);
          doInitialize();
        }
      }, 50);

      // 5초 후 타임아웃
      const timeout = setTimeout(() => {
        clearInterval(checkLoaded);
        if (!window.TossPayments) {
          setError(new Error('Toss Payments SDK 로드 타임아웃'));
          setIsLoading(false);
        }
      }, 5000);

      return () => {
        clearInterval(checkLoaded);
        clearTimeout(timeout);
      };
    }

    const script = document.createElement('script');
    script.src = TOSS_SDK_URL;
    script.async = true;

    script.onload = () => {
      doInitialize();
    };

    script.onerror = () => {
      setError(new Error('Toss Payments SDK 로드에 실패했습니다.'));
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      // cleanup은 하지 않음 (다른 컴포넌트에서 재사용 가능)
    };
  }, [doInitialize]);

  // customerKey 변경 시 재초기화
  useEffect(() => {
    if (window.TossPayments && !isLoading) {
      doInitialize();
    }
  }, [customerKey, doInitialize, isLoading]);

  // 결제 요청
  const requestPayment = useCallback(
    async (options: RequestPaymentOptions) => {
      if (!paymentInstance) {
        throw new Error('Toss Payments SDK가 준비되지 않았습니다.');
      }

      const {
        orderId,
        amount,
        method = 'CARD',
        easyPay,
        orderName = 'Giftify 캐시 충전',
        customerEmail,
        customerName
      } = options;

      const baseUrl = window.location.origin;

      const paymentOptions: TossPaymentOptions = {
        method,
        amount: {
          currency: 'KRW',
          value: amount,
        },
        orderId,
        orderName,
        successUrl: `${baseUrl}/wallet/charge/success`,
        failUrl: `${baseUrl}/wallet/charge/fail`,
        customerEmail,
        customerName,
      };

      // 카드 결제일 경우 추가 옵션
      if (method === 'CARD') {
        paymentOptions.card = {
          useEscrow: false,
          flowMode: easyPay ? 'DIRECT' : 'DEFAULT',
          easyPay,
          useCardPoint: false,
          useAppCardOnly: false,
        };
      }

      await paymentInstance.requestPayment(paymentOptions);
    },
    [paymentInstance]
  );

  return {
    isLoading,
    isReady,
    error,
    requestPayment,
  };
}

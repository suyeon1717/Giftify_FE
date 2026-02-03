'use client';

import { Suspense, useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { confirmPayment } from '@/lib/api/payment';
import { queryKeys } from '@/lib/query/keys';

type PageStatus = 'loading' | 'success' | 'error';

interface ErrorState {
  code: string;
  message: string;
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-[540px] flex flex-col items-center gap-8">
        <img 
          src="https://static.toss.im/lotties/loading-spot-apng.png" 
          alt="로딩" 
          width={120} 
          height={120}
          className="animate-pulse"
        />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">페이지 로딩 중...</h2>
          <p className="text-muted-foreground">잠시만 기다려주세요.</p>
        </div>
      </div>
    </div>
  );
}

function ChargeSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [status, setStatus] = useState<PageStatus>('loading');
  const [error, setError] = useState<ErrorState | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [orderId, setOrderId] = useState<string>('');
  const [paymentKeyValue, setPaymentKeyValue] = useState<string>('');

  useEffect(() => {
    const processPayment = async () => {
      try {
        // URL에서 Toss 결제 결과 파라미터 추출
        const paymentKey = searchParams.get('paymentKey');
        const orderIdParam = searchParams.get('orderId');
        const amountParam = searchParams.get('amount');

        // sessionStorage에서 paymentId 가져오기
        const paymentIdStr = sessionStorage.getItem('pendingPaymentId');

        // 필수 파라미터 검증
        if (!paymentKey || !orderIdParam || !amountParam || !paymentIdStr) {
          throw {
            code: 'INVALID_PARAMS',
            message: '결제 정보가 올바르지 않습니다.',
          };
        }

        const paymentId = parseInt(paymentIdStr, 10);
        const parsedAmount = parseInt(amountParam, 10);
        setAmount(parsedAmount);
        setOrderId(orderIdParam);
        setPaymentKeyValue(paymentKey);

        // 백엔드에 결제 승인 요청
        const result = await confirmPayment({
          paymentId,
          paymentKey,
          orderId: orderIdParam,
          amount: parsedAmount,
        });

        if (result.success) {
          // 성공: sessionStorage 정리 및 캐시 무효화
          sessionStorage.removeItem('pendingPaymentId');
          queryClient.invalidateQueries({ queryKey: queryKeys.wallet });
          queryClient.invalidateQueries({ queryKey: queryKeys.walletHistory() });
          setStatus('success');
        } else {
          throw {
            code: result.errorCode ?? 'CONFIRM_FAILED',
            message: result.errorMessage ?? '결제 승인에 실패했습니다.',
          };
        }
      } catch (err) {
        console.error('결제 승인 처리 실패:', err);
        sessionStorage.removeItem('pendingPaymentId');

        if (err && typeof err === 'object' && 'code' in err) {
          setError(err as ErrorState);
        } else {
          setError({
            code: 'UNKNOWN_ERROR',
            message: '결제 처리 중 오류가 발생했습니다.',
          });
        }
        setStatus('error');
      }
    };

    processPayment();
  }, [searchParams, queryClient]);

  // 로딩 화면 - 결제 승인 대기
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-[540px] flex flex-col items-center justify-between min-h-[400px]">
          <div className="flex flex-col items-center">
            <img 
              src="https://static.toss.im/lotties/loading-spot-apng.png" 
              alt="로딩" 
              width={120} 
              height={120}
            />
            <h2 className="mt-8 text-2xl font-bold text-foreground text-center">
              결제 요청까지 성공했어요.
            </h2>
            <p className="mt-2 text-muted-foreground text-center">
              결제 승인을 처리하고 있습니다...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 에러 화면
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-[540px] flex flex-col items-center">
          <img 
            src="https://static.toss.im/lotties/error-spot-no-loop-space-apng.png" 
            alt="에러" 
            width={160} 
            height={160}
          />
          <h2 className="mt-8 text-2xl font-bold text-foreground">결제를 실패했어요</h2>
          
          <div className="mt-14 w-full space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#333d48]">code</span>
              <span className="text-muted-foreground text-right break-all pl-4">
                {error?.code || '-'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#333d48]">message</span>
              <span className="text-muted-foreground text-right break-all pl-4">
                {error?.message || '-'}
              </span>
            </div>
          </div>

          <div className="mt-8 w-full space-y-4">
            <Button 
              onClick={() => router.push('/wallet')} 
              className="w-full"
            >
              다시 시도하기
            </Button>
            <div className="flex gap-4">
              <Button 
                variant="secondary"
                onClick={() => router.push('/')} 
                className="flex-1"
              >
                홈으로
              </Button>
              <Button 
                variant="secondary"
                asChild
                className="flex-1"
              >
                <Link href="https://docs.tosspayments.com/reference/error-codes" target="_blank">
                  에러코드 문서보기
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 성공 화면
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-[540px] flex flex-col items-center">
        <img 
          src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png" 
          alt="성공" 
          width={120} 
          height={120}
        />
        <h2 className="mt-8 text-2xl font-bold text-foreground">충전을 완료했어요</h2>
        
        <div className="mt-14 w-full space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#333d48]">충전 금액</span>
            <span className="text-muted-foreground font-medium">
              {amount.toLocaleString()}원
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#333d48]">주문번호</span>
            <span className="text-muted-foreground text-right break-all pl-4 text-sm">
              {orderId}
            </span>
          </div>
          <div className="flex justify-between items-start">
            <span className="font-semibold text-[#333d48]">paymentKey</span>
            <span className="text-muted-foreground text-right break-all pl-4 text-xs max-w-[280px]">
              {paymentKeyValue}
            </span>
          </div>
        </div>

        <div className="mt-8 w-full space-y-4">
          <Button 
            onClick={() => router.push('/wallet')} 
            className="w-full"
          >
            지갑으로 이동
          </Button>
          <div className="flex gap-4">
            <Button 
              variant="secondary"
              onClick={() => router.push('/')} 
              className="flex-1"
            >
              홈으로
            </Button>
            <Button 
              variant="secondary"
              onClick={() => router.push('/wallet')} 
              className="flex-1"
            >
              다시 충전하기
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          ※ 본 결제는 테스트 결제이며 실제 비용이 청구되지 않았습니다.
        </p>
      </div>
    </div>
  );
}

export default function ChargeSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ChargeSuccessContent />
    </Suspense>
  );
}

'use client';

import { Suspense, useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';

interface FailInfo {
  code: string;
  message: string;
}

// Toss 에러 코드에 따른 사용자 친화적 메시지
const ERROR_MESSAGES: Record<string, string> = {
  PAY_PROCESS_CANCELED: '결제가 취소되었습니다.',
  PAY_PROCESS_ABORTED: '결제가 중단되었습니다.',
  REJECT_CARD_COMPANY: '카드사에서 결제를 거절했습니다.',
  INVALID_CARD_NUMBER: '유효하지 않은 카드 번호입니다.',
  INVALID_CARD_EXPIRY: '카드 유효기간이 올바르지 않습니다.',
  EXCEED_MAX_DAILY_PAYMENT_COUNT: '일일 결제 한도를 초과했습니다.',
  EXCEED_MAX_PAYMENT_AMOUNT: '결제 한도를 초과했습니다.',
  NOT_SUPPORTED_INSTALLMENT_PLAN: '할부 결제가 지원되지 않습니다.',
  INVALID_STOPPED_CARD: '정지된 카드입니다.',
  EXCEED_MAX_AMOUNT: '결제 금액이 한도를 초과했습니다.',
  INVALID_CARD_LOST_OR_STOLEN: '분실/도난 신고된 카드입니다.',
  NOT_ALLOWED_POINT_USE: '포인트 사용이 불가한 카드입니다.',
  REJECT_ACCOUNT_PAYMENT: '계좌 결제가 거절되었습니다.',
  NOT_AVAILABLE_PAYMENT: '결제가 불가능한 상태입니다.',
};

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

function ChargeFailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [failInfo, setFailInfo] = useState<FailInfo>({
    code: '',
    message: '결제에 실패했습니다.',
  });

  useEffect(() => {
    // sessionStorage 정리
    sessionStorage.removeItem('pendingPaymentId');

    // URL에서 에러 정보 추출
    const code = searchParams.get('code') ?? '';
    const message = searchParams.get('message') ?? '';

    // 사용자 친화적 메시지 매핑
    const userMessage = ERROR_MESSAGES[code] ?? message ?? '결제에 실패했습니다.';

    setFailInfo({
      code,
      message: userMessage,
    });
  }, [searchParams]);

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
              {failInfo.code || '-'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-[#333d48]">message</span>
            <span className="text-muted-foreground text-right break-all pl-4">
              {failInfo.message || '-'}
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
              asChild
              className="flex-1"
            >
              <Link href="https://docs.tosspayments.com/reference/error-codes" target="_blank">
                에러코드 문서보기
              </Link>
            </Button>
            <Button 
              variant="secondary"
              asChild
              className="flex-1"
            >
              <Link href="https://techchat.tosspayments.com" target="_blank">
                실시간 문의하기
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChargeFailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ChargeFailContent />
    </Suspense>
  );
}

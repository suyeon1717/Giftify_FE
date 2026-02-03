'use client';

import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { Loader2, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useTossPayments, PaymentMethod } from '@/features/wallet/hooks/useTossPayments';
import { createChargePayment } from '@/lib/api/payment';
import { cn } from '@/lib/utils';

interface ChargeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CHARGE_AMOUNTS = [10000, 30000, 50000, 100000];
const MIN_CHARGE_AMOUNT = 1000;
const MAX_CHARGE_AMOUNT = 1000000;

// 결제 수단 옵션
const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
  { value: 'CARD', label: '카드', icon: <CreditCard className="h-5 w-5" /> },
  { value: 'TRANSFER', label: '계좌이체', icon: <Building2 className="h-5 w-5" /> },
  { value: 'MOBILE_PHONE', label: '휴대폰', icon: <Smartphone className="h-5 w-5" /> },
];

export function ChargeModal({ open, onOpenChange }: ChargeModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('CARD');

  // 회원 정보 가져오기
  const { user } = useAuth();
  // Toss는 customerKey에 | 문자를 허용하지 않으므로 _ 로 대체
  const customerKey = (user?.sub ?? 'anonymous').replace(/\|/g, '_');

  // Toss SDK 훅
  const { isReady: isTossReady, isLoading: isTossLoading, requestPayment } = useTossPayments(customerKey);

  // Payment 생성 mutation
  const createPaymentMutation = useMutation({
    mutationFn: createChargePayment,
    onError: (error) => {
      console.error('Payment 생성 실패:', error);
      toast.error('결제 준비 중 오류가 발생했습니다.');
    },
  });

  const amount = selectedAmount ?? Number(customAmount);
  const isValidAmount = amount >= MIN_CHARGE_AMOUNT && amount <= MAX_CHARGE_AMOUNT;
  const isProcessing = createPaymentMutation.isPending;

  const handleCharge = async () => {
    if (!isValidAmount) {
      toast.error(`${MIN_CHARGE_AMOUNT.toLocaleString()}원 ~ ${MAX_CHARGE_AMOUNT.toLocaleString()}원 사이의 금액을 입력해주세요.`);
      return;
    }

    if (!isTossReady) {
      toast.error('결제 시스템을 준비 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    try {
      // 1. Payment 레코드 생성
      const paymentResult = await createPaymentMutation.mutateAsync({ amount });

      // 2. paymentId를 sessionStorage에 저장 (success 페이지에서 사용)
      sessionStorage.setItem('pendingPaymentId', paymentResult.paymentId.toString());

      // 3. Toss SDK 결제창 호출 (리다이렉트됨)
      await requestPayment({
        orderId: paymentResult.orderId,
        amount: paymentResult.amount,
        method: selectedMethod,
        orderName: 'Giftify 캐시 충전',
        customerEmail: user?.email ?? undefined,
        customerName: user?.name ?? undefined,
      });

      // 여기까지 오면 사용자가 결제창을 닫은 것
      // (성공 시 successUrl로 리다이렉트되므로 여기까지 안 옴)
    } catch (error) {
      // 사용자가 결제창 닫기 또는 에러
      console.error('결제 요청 실패:', error);
      sessionStorage.removeItem('pendingPaymentId');
      // Toss SDK에서 취소한 경우 에러 메시지 표시하지 않음
      if (error instanceof Error && !error.message.includes('사용자')) {
        toast.error('결제 요청 중 오류가 발생했습니다.');
      }
    }
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handlePresetAmountClick = (presetAmount: number) => {
    setSelectedAmount(presetAmount);
    setCustomAmount('');
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // 모달 닫힐 때 상태 초기화
      setSelectedAmount(null);
      setCustomAmount('');
      setSelectedMethod('CARD');
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl font-bold">포인트 충전</DialogTitle>
        </DialogHeader>
        
        <div className="px-6 py-5 space-y-6">
          {/* 충전 금액 선택 */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-[#333d48]">충전 금액</label>
            <div className="grid grid-cols-2 gap-2">
              {CHARGE_AMOUNTS.map((presetAmount) => (
                <button
                  key={presetAmount}
                  type="button"
                  className={cn(
                    "py-3 px-4 rounded-lg border text-sm font-medium transition-all",
                    selectedAmount === presetAmount
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:border-primary/50 text-foreground"
                  )}
                  onClick={() => handlePresetAmountClick(presetAmount)}
                  disabled={isProcessing}
                >
                  {presetAmount.toLocaleString()}원
                </button>
              ))}
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder="직접 입력"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                min={MIN_CHARGE_AMOUNT}
                max={MAX_CHARGE_AMOUNT}
                disabled={isProcessing}
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                원
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {MIN_CHARGE_AMOUNT.toLocaleString()}원 ~ {MAX_CHARGE_AMOUNT.toLocaleString()}원
            </p>
          </div>

          {/* 결제 수단 선택 */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-[#333d48]">결제 수단</label>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.value}
                  type="button"
                  className={cn(
                    "flex flex-col items-center gap-2 py-4 px-3 rounded-lg border transition-all",
                    selectedMethod === method.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-background hover:border-primary/50 text-muted-foreground"
                  )}
                  onClick={() => setSelectedMethod(method.value)}
                  disabled={isProcessing}
                >
                  {method.icon}
                  <span className="text-xs font-medium">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 테스트 결제 안내 */}
          <div className="rounded-lg bg-[#fff8e6] border border-[#ffcc00]/30 p-4">
            <p className="text-xs text-[#8a6d00] font-medium text-center leading-relaxed">
              ⚠️ 본 결제는 테스트 결제입니다.<br />
              실제 결제가 발생하지 않으니 안심하고 진행해주세요.
            </p>
          </div>

          {isTossLoading && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground py-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              결제 시스템 준비 중...
            </div>
          )}
        </div>

        {/* 결제 버튼 */}
        <div className="px-6 py-4 bg-muted/30 border-t">
          <Button
            className="w-full h-12 text-base font-bold bg-[#3282f6] hover:bg-[#1b64da]"
            onClick={handleCharge}
            disabled={!isValidAmount || isProcessing || !isTossReady}
          >
            {isProcessing && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {amount > 0 ? `${amount.toLocaleString()}원 충전하기` : '금액을 선택해주세요'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

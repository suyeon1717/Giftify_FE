'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { AmountInput } from '@/components/common/AmountInput';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useParticipateFunding } from '@/features/funding/hooks/useFundingMutations';

interface ParticipateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    funding: {
        id: string;
        product: {
            name: string;
        };
        currentAmount: number;
        targetAmount: number;
    };
    onSuccess: () => void;
}

export function ParticipateModal({
    open,
    onOpenChange,
    funding,
    onSuccess
}: ParticipateModalProps) {
    const [amount, setAmount] = useState(0);

    const participateFunding = useParticipateFunding();
    const remainingAmount = funding.targetAmount - funding.currentAmount;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (amount <= 0) {
            toast.error('참여 금액을 입력해주세요.');
            return;
        }

        if (amount > remainingAmount) {
            toast.error(`남은 금액은 ${remainingAmount.toLocaleString()}원 입니다.`);
            return;
        }

        participateFunding.mutate(
            {
                fundingId: funding.id,
                amount,
            },
            {
                onSuccess: () => {
                    toast.success('장바구니에 담겼습니다. 결제를 진행해주세요.');
                    onOpenChange(false);
                    onSuccess();
                    setAmount(0);
                },
                onError: (error) => {
                    toast.error(error instanceof Error ? error.message : '펀딩 참여에 실패했습니다.');
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>펀딩 참여하기</DialogTitle>
                    <DialogDescription>
                        <span className="font-bold text-foreground">{funding.product.name}</span>에 마음을 전하세요.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                    <AmountInput
                        value={amount}
                        onChange={setAmount}
                        maxAmount={remainingAmount}
                        walletBalance={1000000}
                    />

                    <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex justify-between">
                            <span>현재 모금액</span>
                            <span className="font-medium">₩{funding.currentAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>남은 금액</span>
                            <span className="font-medium">₩{remainingAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={participateFunding.isPending || amount <= 0} className="w-full">
                            {participateFunding.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {amount > 0 ? `₩${amount.toLocaleString()} 참여하기` : '참여하기'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

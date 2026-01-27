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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AmountInput } from '@/components/common/AmountInput';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ParticipateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    funding: {
        id: string;
        title: string;
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
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(0);
    const [message, setMessage] = useState('');

    const remainingAmount = funding.targetAmount - funding.currentAmount;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (amount <= 0) {
            toast.error('참여 금액을 입력해주세요.');
            return;
        }

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success('펀딩 참여가 완료되었습니다! (Mock)');
            onOpenChange(false);
            onSuccess();
        }, 1000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>펀딩 참여하기</DialogTitle>
                    <DialogDescription>
                        <span className="font-bold text-foreground">{funding.title}</span>에 마음을 전하세요.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                    <AmountInput
                        value={amount}
                        onChange={setAmount}
                        maxAmount={remainingAmount}
                        walletBalance={1000000} // Mock wallet balance
                    />

                    <div className="grid gap-2">
                        <Label htmlFor="message">응원 메시지</Label>
                        <Input
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="친구에게 따뜻한 한마디를 남겨주세요."
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading || amount <= 0} className="w-full">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {amount > 0 ? `${amount.toLocaleString()}원 참여하기` : '참여하기'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

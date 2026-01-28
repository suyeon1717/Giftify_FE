'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateFunding } from '@/features/funding/hooks/useFundingMutations';
import type { Funding } from '@/types/funding';

interface CreateFundingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    wishItem: {
        id: string;
        product: {
            name: string;
            price: number;
            imageUrl: string;
        };
    };
    onSuccess: (funding: Funding) => void;
}

export function CreateFundingModal({
    open,
    onOpenChange,
    wishItem,
    onSuccess
}: CreateFundingModalProps) {
    const [expiresInDays, setExpiresInDays] = useState(14);
    const [message, setMessage] = useState('');

    const createFunding = useCreateFunding();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (message.length > 500) {
            toast.error('메시지는 최대 500자까지 입력 가능합니다.');
            return;
        }

        createFunding.mutate(
            {
                wishItemId: wishItem.id,
                expiresInDays,
                message: message.trim() || undefined,
            },
            {
                onSuccess: (funding) => {
                    toast.success('펀딩이 시작되었습니다!');
                    onOpenChange(false);
                    onSuccess(funding);
                    setMessage('');
                    setExpiresInDays(14);
                },
                onError: (error) => {
                    toast.error(error instanceof Error ? error.message : '펀딩 시작에 실패했습니다.');
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>펀딩 시작하기</DialogTitle>
                    <DialogDescription>
                        친구들에게 선물을 요청해보세요.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                    {/* Product Display */}
                    <div className="rounded-lg bg-secondary/30 p-4 space-y-3">
                        <p className="text-xs font-medium text-muted-foreground">선택한 상품</p>
                        <div className="flex gap-3">
                            <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                    src={wishItem.product.imageUrl}
                                    alt={wishItem.product.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm line-clamp-2">{wishItem.product.name}</p>
                                <p className="font-bold mt-1">₩{wishItem.product.price.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Expires In Days Slider */}
                    <div className="grid gap-3">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="expiresInDays">펀딩 기간</Label>
                            <span className="text-sm font-bold">{expiresInDays}일</span>
                        </div>
                        <Slider
                            id="expiresInDays"
                            min={1}
                            max={30}
                            step={1}
                            value={[expiresInDays]}
                            onValueChange={(values) => setExpiresInDays(values[0])}
                            className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                            1일 ~ 30일 사이로 설정 가능합니다.
                        </p>
                    </div>

                    {/* Message */}
                    <div className="grid gap-2">
                        <Label htmlFor="message">
                            메시지 (선택)
                            <span className="ml-2 text-xs text-muted-foreground">
                                {message.length}/500
                            </span>
                        </Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="친구들에게 전할 말을 적어주세요."
                            maxLength={500}
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={createFunding.isPending} className="w-full">
                            {createFunding.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            펀딩 시작하기
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

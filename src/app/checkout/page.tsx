'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Wallet, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/features/cart/hooks/useCart';
import { useWallet } from '@/features/wallet/hooks/useWallet';
import { usePlaceOrder } from '@/features/order/hooks/useOrderMutations';
import type { PlaceOrderItemRequest, OrderItemType } from '@/types/order';
import type { CartItem } from '@/types/cart';

/**
 * Cart 아이템을 PlaceOrderItemRequest로 변환
 *
 * @note 현재 Cart 응답에 receiverId가 없어 임시값 사용
 * @todo 백엔드에서 Cart 아이템에 receiverId 포함하거나,
 *       Cart 기반 주문 API 추가 필요
 */
function cartItemToOrderItem(item: CartItem): PlaceOrderItemRequest {
    // isNewFunding이 true면 FUNDING_PENDING, 아니면 FUNDING
    const orderItemType: OrderItemType = item.isNewFunding ? 'FUNDING_PENDING' : 'FUNDING';

    // wishlistItemId: FUNDING_PENDING은 wishItemId, FUNDING은 fundingId
    // 백엔드는 wishlistItemId를 기대하지만, FUNDING 타입의 경우 fundingId만 있음
    // TODO: 백엔드와 협의 필요 - FUNDING 타입에서 wishlistItemId 대신 fundingId 사용 가능 여부
    const wishlistItemId = item.isNewFunding
        ? parseInt(item.funding.wishItemId, 10)
        : parseInt(item.fundingId, 10); // FUNDING 타입에서 임시로 fundingId 사용

    // receiverId: Cart 응답에 없음
    // TODO: 백엔드에서 Cart 아이템에 receiverId 포함 필요
    const receiverId = 0; // 임시값

    return {
        wishlistItemId,
        receiverId,
        amount: item.amount,
        orderItemType,
    };
}

export default function CheckoutPage() {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const { data: cart, isLoading: isCartLoading } = useCart();
    const { data: wallet, isLoading: isWalletLoading } = useWallet();
    const placeOrder = usePlaceOrder();

    const selectedItems = useMemo(() => {
        return cart?.items.filter(item => item.selected) || [];
    }, [cart]);

    const totalAmount = useMemo(() => {
        return selectedItems.reduce((sum, item) => sum + item.amount, 0);
    }, [selectedItems]);

    const orderName = useMemo(() => {
        if (selectedItems.length === 0) return '';
        const firstName = selectedItems[0].funding.product.name;
        if (selectedItems.length === 1) return firstName;
        return `${firstName} 외 ${selectedItems.length - 1}건`;
    }, [selectedItems]);

    const hasInsufficientBalance = wallet ? wallet.balance < totalAmount : false;

    const handlePayment = async () => {
        if (!cart || selectedItems.length === 0) {
            toast.error('결제할 상품이 없습니다.');
            return;
        }

        if (hasInsufficientBalance) {
            toast.error('잔액이 부족합니다. 지갑을 충전해주세요.');
            return;
        }

        setIsProcessing(true);
        try {
            // V2 API: 주문+결제 한 번에 처리
            const orderItems = selectedItems.map(cartItemToOrderItem);

            const result = await placeOrder.mutateAsync({
                items: orderItems,
                method: 'WALLET',
            });

            toast.success('결제가 완료되었습니다!');
            router.push(`/checkout/complete?orderId=${result.orderId}`);
        } catch (error: any) {
            const errorCode = error?.code;

            switch (errorCode) {
                case 'INSUFFICIENT_BALANCE':
                    toast.error('잔액이 부족합니다. 지갑을 충전해주세요.');
                    router.push('/wallet/charge');
                    break;
                case 'MISSING_IDEMPOTENCY_KEY':
                    console.error('Idempotency key missing - this is a frontend bug');
                    toast.error('주문 처리 중 오류가 발생했습니다.');
                    break;
                default:
                    toast.error(error?.message || '결제 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    if (isCartLoading || isWalletLoading) {
        return (
            <AppShell
                headerTitle="주문/결제"
                headerVariant="detail"
                hasBack={true}
                showBottomNav={false}
            >
                <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </AppShell>
        );
    }

    if (!cart || selectedItems.length === 0) {
        return (
            <AppShell
                headerTitle="주문/결제"
                headerVariant="detail"
                hasBack={true}
                showBottomNav={false}
            >
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] gap-4 p-4">
                    <AlertCircle className="h-12 w-12 text-muted-foreground" />
                    <div className="text-center">
                        <h3 className="text-lg font-semibold mb-1">주문할 상품이 없습니다</h3>
                        <p className="text-sm text-muted-foreground">
                            장바구니에서 상품을 선택해주세요.
                        </p>
                    </div>
                    <Button onClick={() => router.push('/cart')}>
                        장바구니로 이동
                    </Button>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell
            headerTitle="주문/결제"
            headerVariant="detail"
            hasBack={true}
            showBottomNav={false}
        >
            <div className="p-4 space-y-6 pb-24 max-w-lg mx-auto">
                <section className="space-y-4">
                    <h2 className="text-lg font-bold">주문 상품 정보</h2>
                    <Card className="border-border bg-card">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-base">{orderName}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-sm text-muted-foreground space-y-1">
                            {selectedItems.map((item) => (
                                <div key={item.id} className="flex justify-between">
                                    <span className="line-clamp-1">{item.funding.product.name}</span>
                                    <span className="ml-2 flex-shrink-0">{item.amount.toLocaleString()}원</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>

                <section className="space-y-4">
                    <h2 className="text-lg font-bold">결제 정보</h2>
                    <Card className="border-border bg-card">
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">총 펀딩 참여</span>
                                <span>{selectedItems.length}건</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg text-primary">
                                <span>최종 결제 금액</span>
                                <span>{totalAmount.toLocaleString()}원</span>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="space-y-4">
                    <h2 className="text-lg font-bold">결제 수단</h2>
                    <Card className="border-border bg-card">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Wallet className="h-5 w-5 text-primary" />
                                    <span className="font-medium">Giftify 지갑</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-muted-foreground">잔액</div>
                                    <div className="font-bold text-lg">
                                        {wallet?.balance.toLocaleString() || 0}원
                                    </div>
                                </div>
                            </div>
                            {hasInsufficientBalance && (
                                <Alert variant="destructive" className="mt-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        잔액이 부족합니다. 지갑을 충전해주세요.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </section>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border z-20 md:static md:border-t-0">
                <Button
                    className="w-full h-12 text-lg font-bold"
                    onClick={handlePayment}
                    disabled={isProcessing || hasInsufficientBalance}
                >
                    {isProcessing && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                    {totalAmount.toLocaleString()}원 결제하기
                </Button>
            </div>
        </AppShell>
    );
}

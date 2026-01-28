'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { WishItemCard } from '@/components/common/WishItemCard';
import { WishlistHeader } from '@/features/wishlist/components/WishlistHeader';
import { WishlistEmptyState } from '@/features/wishlist/components/WishlistEmptyState';
import { VisibilitySheet } from '@/features/wishlist/components/VisibilitySheet';
import { CreateFundingModal } from '@/features/funding/components/CreateFundingModal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useMyWishlist } from '@/features/wishlist/hooks/useWishlist';
import { useUpdateVisibility, useRemoveWishlistItem } from '@/features/wishlist/hooks/useWishlistMutations';
import { WishlistVisibility, WishItem } from '@/types/wishlist';
import { toast } from 'sonner';

export default function MyWishlistPage() {
    const router = useRouter();
    const { data: wishlist, isLoading, error } = useMyWishlist();
    const updateVisibility = useUpdateVisibility();
    const removeItem = useRemoveWishlistItem();

    const [visibilitySheetOpen, setVisibilitySheetOpen] = useState(false);
    const [fundingModalOpen, setFundingModalOpen] = useState(false);
    const [selectedWishItem, setSelectedWishItem] = useState<WishItem | null>(null);

    const handleVisibilityChange = async (visibility: WishlistVisibility) => {
        try {
            await updateVisibility.mutateAsync({ visibility });
            toast.success('공개 설정이 변경되었습니다');
        } catch {
            toast.error('공개 설정 변경에 실패했습니다');
        }
    };

    const handleStartFunding = (item: WishItem) => {
        setSelectedWishItem(item);
        setFundingModalOpen(true);
    };

    const handleDeleteItem = async (itemId: string) => {
        try {
            await removeItem.mutateAsync(itemId);
            toast.success('위시 아이템이 삭제되었습니다');
        } catch {
            toast.error('삭제에 실패했습니다');
        }
    };

    const handleViewFunding = (fundingId: string) => {
        router.push(`/fundings/${fundingId}`);
    };

    const handleAddItem = () => {
        router.push('/products');
    };

    // Group items by status
    const groupedItems = {
        AVAILABLE: wishlist?.items.filter(item => item.status === 'AVAILABLE') || [],
        IN_FUNDING: wishlist?.items.filter(item => item.status === 'IN_FUNDING') || [],
        FUNDED: wishlist?.items.filter(item => item.status === 'FUNDED') || [],
    };

    // Loading state
    if (isLoading) {
        return (
            <AppShell
                headerTitle="내 위시리스트"
                headerVariant="detail"
                showBottomNav={true}
            >
                <div className="p-4 space-y-4">
                    <Skeleton className="h-16 w-full" />
                    <Separator />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </AppShell>
        );
    }

    // Error state
    if (error) {
        return (
            <AppShell
                headerTitle="내 위시리스트"
                headerVariant="detail"
                showBottomNav={true}
            >
                <div className="flex items-center justify-center min-h-[50vh] p-4">
                    <div className="text-center space-y-2">
                        <p className="text-lg font-medium text-destructive">위시리스트를 불러올 수 없습니다</p>
                        <p className="text-sm text-muted-foreground">잠시 후 다시 시도해주세요</p>
                        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
                            새로고침
                        </Button>
                    </div>
                </div>
            </AppShell>
        );
    }

    // Empty state
    if (!wishlist || wishlist.items.length === 0) {
        return (
            <AppShell
                headerTitle="내 위시리스트"
                headerVariant="detail"
                showBottomNav={true}
            >
                <WishlistHeader
                    isOwner={true}
                    itemCount={0}
                    visibility={wishlist?.visibility || 'PUBLIC'}
                    onVisibilityChange={() => setVisibilitySheetOpen(true)}
                />
                <Separator />
                <WishlistEmptyState onAddItem={handleAddItem} />

                <VisibilitySheet
                    open={visibilitySheetOpen}
                    onOpenChange={setVisibilitySheetOpen}
                    currentVisibility={wishlist?.visibility || 'PUBLIC'}
                    onVisibilityChange={handleVisibilityChange}
                />
            </AppShell>
        );
    }

    return (
        <AppShell
            headerTitle="내 위시리스트"
            headerVariant="detail"
            showBottomNav={true}
        >
            <WishlistHeader
                isOwner={true}
                itemCount={wishlist.itemCount}
                visibility={wishlist.visibility}
                onVisibilityChange={() => setVisibilitySheetOpen(true)}
            />

            <Separator />

            <div className="flex flex-col gap-6 p-4 pb-24">
                {/* AVAILABLE items */}
                {groupedItems.AVAILABLE.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground">펀딩 가능</h3>
                        {groupedItems.AVAILABLE.map((item) => (
                            <WishItemCard
                                key={item.id}
                                item={{
                                    id: item.id,
                                    product: item.product,
                                    status: item.status,
                                    addedAt: item.createdAt,
                                }}
                                isOwner={true}
                                onAction={() => handleStartFunding(item)}
                                onDelete={() => handleDeleteItem(item.id)}
                            />
                        ))}
                    </div>
                )}

                {/* IN_FUNDING items */}
                {groupedItems.IN_FUNDING.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground">펀딩 진행중</h3>
                        {groupedItems.IN_FUNDING.map((item) => (
                            <WishItemCard
                                key={item.id}
                                item={{
                                    id: item.id,
                                    product: item.product,
                                    status: item.status,
                                    addedAt: item.createdAt,
                                }}
                                isOwner={true}
                                onAction={() => item.fundingId && handleViewFunding(item.fundingId)}
                                onDelete={() => handleDeleteItem(item.id)}
                            />
                        ))}
                    </div>
                )}

                {/* FUNDED items */}
                {groupedItems.FUNDED.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground">펀딩 완료</h3>
                        {groupedItems.FUNDED.map((item) => (
                            <WishItemCard
                                key={item.id}
                                item={{
                                    id: item.id,
                                    product: item.product,
                                    status: item.status,
                                    addedAt: item.createdAt,
                                }}
                                isOwner={true}
                                onDelete={() => handleDeleteItem(item.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-20 left-0 right-0 flex justify-center px-4 z-40 pointer-events-none">
                <Button
                    size="lg"
                    onClick={handleAddItem}
                    className="w-full max-w-sm shadow-xl rounded-full pointer-events-auto h-12 text-base"
                >
                    <Plus className="mr-2 h-5 w-5" /> 위시 추가하기
                </Button>
            </div>

            {/* Modals */}
            <VisibilitySheet
                open={visibilitySheetOpen}
                onOpenChange={setVisibilitySheetOpen}
                currentVisibility={wishlist.visibility}
                onVisibilityChange={handleVisibilityChange}
            />

            {selectedWishItem && (
                <CreateFundingModal
                    open={fundingModalOpen}
                    onOpenChange={setFundingModalOpen}
                    wishItem={{
                        id: selectedWishItem.id,
                        product: selectedWishItem.product,
                    }}
                    onSuccess={() => {
                        setFundingModalOpen(false);
                        toast.success('펀딩이 생성되었습니다');
                    }}
                />
            )}
        </AppShell>
    );
}

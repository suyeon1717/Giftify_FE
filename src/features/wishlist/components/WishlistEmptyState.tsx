'use client';

import { Button } from '@/components/ui/button';
import { Gift, Plus, Sparkles } from 'lucide-react';

interface WishlistEmptyStateProps {
    onAddItem: () => void;
}

export function WishlistEmptyState({ onAddItem }: WishlistEmptyStateProps) {
    return (
        <div className="flex items-center justify-center min-h-[60vh] p-4">
            <div className="text-center space-y-6 max-w-sm">
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                        <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 p-8 rounded-full">
                            <Gift className="h-16 w-16 text-primary" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-bold">위시리스트가 비어있어요</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        받고 싶은 선물을 위시리스트에 추가하고
                        <br />
                        친구들과 함께 펀딩을 시작해보세요
                    </p>
                </div>

                <div className="space-y-3 pt-4">
                    <Button
                        onClick={onAddItem}
                        size="lg"
                        className="w-full h-12 text-base gap-2 shadow-lg"
                    >
                        <Plus className="h-5 w-5" />
                        첫 번째 위시 추가하기
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>상품을 검색하여 추가할 수 있어요</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 text-center">
                    <div className="space-y-1">
                        <div className="text-2xl">🎁</div>
                        <p className="text-xs text-muted-foreground">원하는 선물<br />추가</p>
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl">💰</div>
                        <p className="text-xs text-muted-foreground">친구들과<br />펀딩</p>
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl">🎉</div>
                        <p className="text-xs text-muted-foreground">선물<br />받기</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

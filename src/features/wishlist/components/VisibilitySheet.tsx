'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Globe, Users, Lock, Check } from 'lucide-react';
import { WishlistVisibility } from '@/types/wishlist';
import { cn } from '@/lib/utils';

interface VisibilitySheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentVisibility: WishlistVisibility;
    onVisibilityChange: (visibility: WishlistVisibility) => void;
}

const VISIBILITY_OPTIONS = [
    {
        value: 'PUBLIC' as WishlistVisibility,
        icon: Globe,
        label: '전체 공개',
        description: '모든 사람이 내 위시리스트를 볼 수 있습니다',
    },
    {
        value: 'FRIENDS_ONLY' as WishlistVisibility,
        icon: Users,
        label: '친구만 공개',
        description: '친구로 등록된 사람만 볼 수 있습니다',
    },
    {
        value: 'PRIVATE' as WishlistVisibility,
        icon: Lock,
        label: '비공개',
        description: '나만 볼 수 있습니다',
    },
];

export function VisibilitySheet({
    open,
    onOpenChange,
    currentVisibility,
    onVisibilityChange,
}: VisibilitySheetProps) {
    const [selectedVisibility, setSelectedVisibility] = useState(currentVisibility);

    const handleConfirm = () => {
        if (selectedVisibility !== currentVisibility) {
            onVisibilityChange(selectedVisibility);
        }
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="rounded-t-3xl">
                <SheetHeader>
                    <SheetTitle>공개 범위 설정</SheetTitle>
                    <SheetDescription>
                        위시리스트를 누가 볼 수 있는지 선택하세요
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-3">
                    {VISIBILITY_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        const isSelected = selectedVisibility === option.value;

                        return (
                            <button
                                key={option.value}
                                onClick={() => setSelectedVisibility(option.value)}
                                className={cn(
                                    'w-full flex items-start gap-4 p-4 rounded-lg border-2 transition-all text-left',
                                    isSelected
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                                )}
                            >
                                <div className={cn(
                                    'mt-0.5 p-2 rounded-full',
                                    isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                                )}>
                                    <Icon className="h-5 w-5" />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold">{option.label}</h4>
                                        {isSelected && (
                                            <Check className="h-5 w-5 text-primary" />
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {option.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-6 flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex-1"
                    >
                        취소
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className="flex-1"
                        disabled={selectedVisibility === currentVisibility}
                    >
                        변경하기
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}

'use client';

import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AccessDeniedView() {
    const router = useRouter();

    return (
        <div className="flex items-center justify-center min-h-[60vh] p-4">
            <div className="text-center space-y-6 max-w-sm">
                <div className="flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-destructive/10 rounded-full blur-2xl" />
                        <div className="relative bg-gradient-to-br from-destructive/20 to-destructive/5 p-8 rounded-full">
                            <Lock className="h-16 w-16 text-destructive" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-bold">비공개 위시리스트</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        이 위시리스트는 비공개로 설정되어 있어
                        <br />
                        접근할 수 없습니다
                    </p>
                </div>

                <div className="space-y-3 pt-4">
                    <Button
                        onClick={() => router.back()}
                        size="lg"
                        className="w-full h-12 text-base gap-2"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        뒤로 가기
                    </Button>

                    <Button
                        onClick={() => router.push('/')}
                        variant="outline"
                        size="lg"
                        className="w-full h-12 text-base"
                    >
                        홈으로 가기
                    </Button>
                </div>

                <div className="pt-6 space-y-2">
                    <p className="text-xs text-muted-foreground">
                        위시리스트 공개 설정
                    </p>
                    <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span>전체 공개</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span>친구만</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-gray-500" />
                            <span>비공개</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useProfile } from '@/features/profile/hooks/useProfile';

export function WelcomeSection() {
    const { user, isLoading: isAuthLoading } = useUser();
    const { data: member, isLoading: isProfileLoading } = useProfile();

    const isLoading = isAuthLoading || isProfileLoading;

    if (isLoading) {
        return (
            <section className="px-4 py-6">
                <div className="h-20 animate-pulse rounded-lg bg-secondary" />
            </section>
        );
    }

    if (!user) {
        return (
            <section className="px-4 py-6">
                <div className="rounded-lg bg-indigo-50 p-6 text-center dark:bg-indigo-950/30">
                    <h2 className="mb-2 text-lg font-bold">친구들과 함께 선물하기</h2>
                    <p className="mb-4 text-sm text-muted-foreground">로그인하고 펀딩을 시작해보세요!</p>
                    <Button asChild>
                        <a href="/auth/login">로그인 / 회원가입</a>
                    </Button>
                </div>
            </section>
        );
    }

    return (
        <section className="px-4 py-6">
            <div className="rounded-lg bg-indigo-50 p-6 dark:bg-indigo-950/30">
                <h2 className="text-xl font-bold text-foreground">
                    👋 안녕하세요, {member?.nickname || user.name || user.nickname || '친구'}님!
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    오늘도 특별한 선물을 준비해보세요.
                </p>
            </div>
        </section>
    );
}

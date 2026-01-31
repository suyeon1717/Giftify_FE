'use client';

import { use, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import { UserHomeHero } from '@/features/user-home/components/UserHomeHero';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FundingCard } from '@/components/common/FundingCard';

// Mock Data
const MOCK_USER = {
    id: 'user-1',
    nickname: 'Giftify Curator',
    description: "특별한 순간을 더욱 빛나게.\n감각적인 아이템들을 큐레이션하여 펀딩을 진행합니다.",
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    coverImageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80',
    followerCount: 1240,
    isFollowing: false,
};

const MOCK_FUNDINGS = Array.from({ length: 8 }).map((_, i) => ({
    id: `funding-${i}`,
    wishItemId: `wi-${i}`,
    organizerId: 'user-1',
    organizer: { id: 'user-1', nickname: MOCK_USER.nickname, avatarUrl: MOCK_USER.avatarUrl },
    recipientId: 'recipient-1',
    recipient: { id: 'recipient-1', nickname: 'Friend', avatarUrl: '' },
    product: {
        id: `p-${i}`,
        name: i % 2 === 0 ? "Leica Q2 Monochrom" : "Marshall Stanmore II",
        price: i % 2 === 0 ? 8900000 : 560000,
        imageUrl: i % 2 === 0
            ? 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80'
            : 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=800&q=80',
        status: 'ON_SALE' as const
    },
    targetAmount: i % 2 === 0 ? 8900000 : 560000,
    currentAmount: i % 2 === 0 ? 4500000 : 560000,
    status: i < 2 ? 'IN_PROGRESS' : i < 5 ? 'ACHIEVED' : 'CLOSED',
    participantCount: 15,
    expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    createdAt: new Date().toISOString()
}));

export function UserHomeContent({ userId }: { userId: string }) {
    // In real app, fetch user data here
    const user = { ...MOCK_USER, id: userId };

    const ongoingFundings = MOCK_FUNDINGS.filter(f => f.status === 'IN_PROGRESS');
    const endedFundings = MOCK_FUNDINGS.filter(f => f.status !== 'IN_PROGRESS');

    return (
        <AppShell
            headerVariant="main"
            showBottomNav={false}
        >
            <UserHomeHero user={user} />

            <div className="max-w-screen-xl mx-auto px-4 md:px-8 pb-24">
                <Tabs defaultValue="ongoing" className="w-full">
                    <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-8 mb-8">
                        <TabsTrigger
                            value="ongoing"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-0 py-3 font-medium hover:text-black transition-colors"
                        >
                            진행중인 펀딩 <span className="ml-1 text-xs text-muted-foreground font-normal">{ongoingFundings.length}</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="ended"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-0 py-3 font-medium hover:text-black transition-colors"
                        >
                            종료된 펀딩 <span className="ml-1 text-xs text-muted-foreground font-normal">{endedFundings.length}</span>
                        </TabsTrigger>
                        <TabsTrigger
                            value="reviews"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent px-0 py-3 font-medium hover:text-black transition-colors"
                        >
                            받은 후기 <span className="ml-1 text-xs text-muted-foreground font-normal">24</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="ongoing" className="mt-0">
                        {ongoingFundings.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {ongoingFundings.map(funding => (
                                    <FundingCard key={funding.id} funding={funding as any} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 text-center text-muted-foreground">
                                진행중인 펀딩이 없습니다.
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="ended" className="mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {endedFundings.map(funding => (
                                <FundingCard key={funding.id} funding={funding as any} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="reviews" className="mt-0">
                        <div className="py-24 text-center text-muted-foreground">
                            준비 중인 기능입니다.
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <Footer />
        </AppShell>
    );
}

export default function UserHomePage({ params }: { params: Promise<{ userId: string }> }) {
    const container = use(params);
    const { userId } = container;
    return <UserHomeContent userId={userId} />;
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FundingActionBox } from '@/features/funding/components/FundingActionBox';
import { ParticipateModal } from '@/features/funding/components/ParticipateModal';
import { Separator } from '@/components/ui/separator';

export default function FundingDetailPage() {
    const params = useParams();
    const id = params.id as string;
    const [participateModalOpen, setParticipateModalOpen] = useState(false); // Added state for modal

    /**
     * [Mock Data] 펀딩 상세 정보를 정의합니다.
     * 실제 구현 시에는 react-query의 useQuery를 통해 API로부터 데이터를 받아와야 합니다.
     * @see {@link "@/features/funding/api/useFundingDetail"} (추후 구현 예정)
     */
    const funding = {
        id,
        title: '친구가 갖고 싶어하는 에어팟 프로',
        description: '생일 선물로 에어팟 프로를 선물해주고 싶어합니다! 함께 해주세요.',
        product: {
            name: 'Apple 에어팟 프로 2세대',
            imageUrl: '/images/placeholder-product-1.jpg',
            price: 329000,
        },
        recipient: {
            name: '김철수',
            avatar: '',
        },
        currentAmount: 150000,
        targetAmount: 329000,
        participantCount: 5,
        status: 'IN_PROGRESS',
        createdAt: new Date().toISOString(),
    };

    return (
        <AppShell
            headerTitle="펀딩 상세"
            headerVariant="detail"
            hasBack={true}
            showBottomNav={false} // Detail page often hides bottom nav
        >
            <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
                {/* Product Image */}
                <div className="relative aspect-square w-full bg-secondary md:aspect-video">
                    <Image
                        src={funding.product.imageUrl}
                        alt={funding.product.name}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 p-4 space-y-6 pb-24">
                    {/* Recipient Info */}
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={funding.recipient.avatar} />
                            <AvatarFallback>{funding.recipient.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">To.</p>
                            <p className="font-bold">{funding.recipient.name}</p>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-xl font-bold leading-tight">{funding.title}</h1>
                        <p className="mt-2 text-sm text-muted-foreground">{funding.description}</p>
                    </div>

                    <div className="rounded-lg bg-secondary/30 p-4">
                        <p className="text-xs text-muted-foreground mb-1">상품 정보</p>
                        <p className="font-medium text-sm">{funding.product.name}</p>
                        <p className="font-bold">₩{funding.product.price.toLocaleString()}</p>
                    </div>

                    <Separator />

                    {/* Participants Preview (Optional) */}
                    <div>
                        <h3 className="text-sm font-bold mb-3">참여자 목록 ({funding.participantCount})</h3>
                        <div className="flex -space-x-2 overflow-hidden">
                            {[...Array(3)].map((_, i) => (
                                <Avatar key={i} className="border-2 border-background w-8 h-8">
                                    <AvatarFallback className="text-[10px]">user</AvatarFallback>
                                </Avatar>
                            ))}
                            {funding.participantCount > 3 && (
                                <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground">
                                    +{funding.participantCount - 3}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sticky Action Box */}
                <div className="fixed bottom-0 left-0 right-0 bg-background z-20 md:static">
                    <FundingActionBox
                        funding={funding}
                        onParticipate={() => setParticipateModalOpen(true)} // Modified onParticipate
                    />
                </div>

                {/* Participate Modal */}
                <ParticipateModal
                    open={participateModalOpen}
                    onOpenChange={setParticipateModalOpen}
                    funding={funding}
                    onSuccess={() => console.log('Participation Success')}
                />
            </div>
        </AppShell>
    );
}

'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import { ReviewCard } from '@/features/review/components/ReviewCard';
import { ReviewDetailSlide } from '@/features/review/components/ReviewDetailSlide';
import { Button } from '@/components/ui/button';

// Mock Data
const REVIEWS = Array.from({ length: 24 }).map((_, i) => ({
    id: `review-${i}`,
    imageUrl: `https://images.unsplash.com/photo-${[
        '1516035069371-29a1b244cc32',
        '1488161628813-99bbb519db92',
        '1524758631624-e2822e304c36',
        '1513201099705-a9746e1e201f',
        '1489987707025-afc232f7ea0f',
        '1549007994-cb92caebd54b'
    ][i % 6]}?w=600&q=80`,
    userName: `User${i + 1}`,
    rating: 5,
    content: "너무 마음에 드는 선물이었어요! 친구가 좋아해서 저도 기분이 좋네요. 포장도 꼼꼼하고 배송도 빨랐습니다. 다음에 또 이용할게요.",
    productName: "Premium Gift Item",
    productBrand: "BRAND NAME",
    productImage: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=200&q=80",
    date: "2026.01.31"
}));

export default function ReviewsPage() {
    const [selectedReview, setSelectedReview] = useState<any>(null);

    return (
        <AppShell
            headerVariant="main"
            showBottomNav={false}
        >
            <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Review Snap</h1>
                        <p className="text-muted-foreground">
                            생생한 후기 사진들을 만나보세요.
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2">
                        <Button variant="default" size="sm" className="rounded-full">All</Button>
                        <Button variant="outline" size="sm" className="rounded-full">Photo Best</Button>
                        <Button variant="outline" size="sm" className="rounded-full">Video</Button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0.5 md:gap-1">
                    {REVIEWS.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            onClick={() => setSelectedReview(review)}
                        />
                    ))}
                </div>

                {/* Load More */}
                <div className="mt-12 text-center">
                    <Button variant="outline" className="w-full max-w-xs">
                        더보기
                    </Button>
                </div>
            </div>

            <Footer />

            <ReviewDetailSlide
                review={selectedReview}
                open={!!selectedReview}
                onOpenChange={(open) => !open && setSelectedReview(null)}
            />
        </AppShell>
    );
}

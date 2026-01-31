'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';

// Navigation items - 29cm style
const NAV_ITEMS = [
    { label: 'Special-Order', href: '/special', active: true },
    { label: 'Showcase', href: '/showcase' },
    { label: 'PT', href: '/pt' },
    { label: '29Magazine', href: '/magazine' },
];

// Category filters
const CATEGORY_FILTERS = [
    { label: 'BEST', value: 'best' },
    { label: 'WOMEN', value: 'women' },
    { label: 'MEN', value: 'men' },
    { label: 'INTERIOR', value: 'interior' },
    { label: 'KITCHEN', value: 'kitchen' },
    { label: 'DIGITAL', value: 'digital' },
    { label: 'BEAUTY', value: 'beauty' },
    { label: 'FOOD', value: 'food' },
    { label: 'LEISURE', value: 'leisure' },
    { label: 'KIDS', value: 'kids' },
    { label: 'CULTURE', value: 'culture' },
];

// Mock data for special fundings
const SPECIAL_FUNDINGS = [
    {
        id: '1',
        title: '따뜻한 겨울을 위한 프리미엄 캐시미어 코트 컬렉션',
        brandName: 'THEORY',
        price: 890000,
        discountRate: 20,
        imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&h=800&fit=crop',
        participantCount: 156,
        daysLeft: 12,
        isNew: true,
        isBest: false,
    },
    {
        id: '2',
        title: '2025 S/S 신상품 선주문 특가',
        brandName: 'COS',
        price: 259000,
        discountRate: 15,
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
        participantCount: 89,
        daysLeft: 7,
        isNew: true,
        isBest: true,
    },
    {
        id: '3',
        title: '수제 가죽 토트백 한정판',
        brandName: 'MATIN KIM',
        price: 420000,
        discountRate: 0,
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop',
        participantCount: 234,
        daysLeft: 3,
        isNew: false,
        isBest: true,
    },
    {
        id: '4',
        title: '클래식 울 블랜드 니트 세트',
        brandName: 'ACNE STUDIOS',
        price: 380000,
        discountRate: 25,
        imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=800&fit=crop',
        participantCount: 67,
        daysLeft: 15,
        isNew: false,
        isBest: false,
    },
    {
        id: '5',
        title: '프리미엄 홈 프레그런스 기프트 세트',
        brandName: 'DIPTYQUE',
        price: 185000,
        discountRate: 10,
        imageUrl: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=600&h=800&fit=crop',
        participantCount: 312,
        daysLeft: 5,
        isNew: true,
        isBest: true,
    },
    {
        id: '6',
        title: '핸드메이드 세라믹 디너웨어 컬렉션',
        brandName: 'STUDIO BENN',
        price: 156000,
        discountRate: 0,
        imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=800&fit=crop',
        participantCount: 45,
        daysLeft: 21,
        isNew: false,
        isBest: false,
    },
    {
        id: '7',
        title: '리미티드 에디션 스니커즈',
        brandName: 'NEW BALANCE',
        price: 219000,
        discountRate: 0,
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop',
        participantCount: 543,
        daysLeft: 2,
        isNew: false,
        isBest: true,
    },
    {
        id: '8',
        title: '오가닉 코튼 홈웨어 세트',
        brandName: 'MUJI',
        price: 89000,
        discountRate: 20,
        imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=800&fit=crop',
        participantCount: 178,
        daysLeft: 9,
        isNew: true,
        isBest: false,
    },
    {
        id: '9',
        title: '빈티지 라탄 인테리어 바스켓',
        brandName: 'HAY',
        price: 78000,
        discountRate: 15,
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=800&fit=crop',
        participantCount: 92,
        daysLeft: 14,
        isNew: false,
        isBest: false,
    },
    {
        id: '10',
        title: '프리미엄 LED 데스크 램프',
        brandName: 'ANGLEPOISE',
        price: 340000,
        discountRate: 30,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
        participantCount: 28,
        daysLeft: 18,
        isNew: true,
        isBest: false,
    },
    {
        id: '11',
        title: '수제 초콜릿 기프트 박스',
        brandName: 'GODIVA',
        price: 68000,
        discountRate: 0,
        imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&h=800&fit=crop',
        participantCount: 421,
        daysLeft: 4,
        isNew: false,
        isBest: true,
    },
    {
        id: '12',
        title: '클래식 울 트렌치 코트',
        brandName: 'BURBERRY',
        price: 2890000,
        discountRate: 15,
        imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop',
        participantCount: 34,
        daysLeft: 25,
        isNew: true,
        isBest: false,
    },
];

interface SpecialFunding {
    id: string;
    title: string;
    brandName: string;
    price: number;
    discountRate: number;
    imageUrl: string;
    participantCount: number;
    daysLeft: number;
    isNew: boolean;
    isBest: boolean;
}

export default function SpecialOrderPage() {
    const [activeCategory, setActiveCategory] = useState('best');
    const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
    const [isLoading] = useState(false);

    const toggleLike = (id: string) => {
        setLikedItems((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    if (isLoading) {
        return (
            <AppShell headerVariant="main">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i}>
                                <Skeleton className="aspect-[3/4]" />
                                <Skeleton className="h-3 w-16 mt-3" />
                                <Skeleton className="h-4 w-full mt-2" />
                                <Skeleton className="h-4 w-20 mt-2" />
                            </div>
                        ))}
                    </div>
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell headerVariant="main">
            <div className="min-h-screen flex flex-col">
                {/* Sub Navigation - 29cm Style */}
                <div className="border-b border-border sticky top-14 bg-background z-40">
                    <div className="max-w-7xl mx-auto px-4 lg:px-8">
                        {/* Main Nav */}
                        <div className="flex items-center gap-6 py-4 text-sm">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'transition-colors',
                                        item.active
                                            ? 'font-semibold text-foreground'
                                            : 'text-muted-foreground hover:text-foreground'
                                    )}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        {/* Category Filters */}
                        <div className="flex gap-4 pb-4 overflow-x-auto scrollbar-hide text-xs">
                            {CATEGORY_FILTERS.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setActiveCategory(cat.value)}
                                    className={cn(
                                        'whitespace-nowrap transition-colors',
                                        activeCategory === cat.value
                                            ? 'font-medium text-foreground'
                                            : 'text-muted-foreground hover:text-foreground'
                                    )}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1">
                    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
                        {/* Page Title */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-semibold mb-2">Special Funding</h1>
                            <p className="text-sm text-muted-foreground">
                                특별한 기회를 놓치지 마세요. 한정된 기간 동안만 진행되는 스페셜 펀딩입니다.
                            </p>
                        </div>

                        {/* Product Grid - 29cm Style */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-x-6 lg:gap-y-10">
                            {SPECIAL_FUNDINGS.map((item) => (
                                <SpecialFundingCard
                                    key={item.id}
                                    item={item}
                                    isLiked={likedItems.has(item.id)}
                                    onToggleLike={() => toggleLike(item.id)}
                                />
                            ))}
                        </div>

                        {/* Load More */}
                        <div className="text-center mt-12">
                            <button className="px-8 py-3 border border-border text-sm hover:bg-secondary transition-colors">
                                더보기
                            </button>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </AppShell>
    );
}

/**
 * Special Funding Card Component - 29cm Style
 */
function SpecialFundingCard({
    item,
    isLiked,
    onToggleLike,
}: {
    item: SpecialFunding;
    isLiked: boolean;
    onToggleLike: () => void;
}) {
    const discountedPrice = item.discountRate > 0
        ? item.price * (1 - item.discountRate / 100)
        : item.price;

    return (
        <div className="group relative">
            {/* Image */}
            <Link href={`/showcase/${item.id}`}>
                <div className="relative aspect-[3/4] bg-secondary overflow-hidden">
                    <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {item.isNew && (
                            <span className="px-2 py-0.5 bg-foreground text-background text-[10px] font-medium">
                                NEW
                            </span>
                        )}
                        {item.isBest && (
                            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-medium">
                                BEST
                            </span>
                        )}
                    </div>

                    {/* D-Day Badge */}
                    {item.daysLeft <= 7 && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-black/70 text-white text-[10px]">
                            <Clock className="h-3 w-3" strokeWidth={1.5} />
                            D-{item.daysLeft}
                        </div>
                    )}
                </div>
            </Link>

            {/* Like Button */}
            <button
                onClick={onToggleLike}
                className="absolute top-3 right-3 p-1 transition-opacity"
                aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                <Heart
                    className={cn(
                        'h-5 w-5 transition-all',
                        isLiked ? 'fill-foreground text-foreground' : 'text-white drop-shadow-md'
                    )}
                    strokeWidth={1.5}
                />
            </button>

            {/* Info */}
            <div className="mt-3 space-y-1">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
                    {item.brandName}
                </p>
                <Link href={`/showcase/${item.id}`}>
                    <p className="text-sm line-clamp-2 hover:underline transition-all leading-relaxed">
                        {item.title}
                    </p>
                </Link>

                {/* Price */}
                <div className="flex items-baseline gap-2 pt-1">
                    {item.discountRate > 0 && (
                        <span className="text-sm font-semibold text-red-500">
                            {item.discountRate}%
                        </span>
                    )}
                    <span className="text-sm font-medium">
                        {formatPrice(discountedPrice)}
                    </span>
                    {item.discountRate > 0 && (
                        <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(item.price)}
                        </span>
                    )}
                </div>

                {/* Participants */}
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground pt-1">
                    <Users className="h-3 w-3" strokeWidth={1.5} />
                    <span>{item.participantCount}명 참여</span>
                </div>
            </div>
        </div>
    );
}

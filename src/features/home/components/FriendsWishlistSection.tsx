'use client';

import Link from 'next/link';
import { ChevronRight, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { FriendWishlistItem } from '@/types/wishlist';

interface FriendsWishlistSectionProps {
    friendsWishlists: FriendWishlistItem[];
}

export function FriendsWishlistSection({ friendsWishlists }: FriendsWishlistSectionProps) {
    if (friendsWishlists.length === 0) {
        return (
            <section className="space-y-4 py-6">
                <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-bold">📋 친구들의 위시리스트</h2>
                </div>
                <div className="px-4">
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center bg-secondary/20">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-sm font-medium mb-1">친구들의 위시리스트가 없어요</p>
                        <p className="text-xs text-muted-foreground mb-4">
                            친구를 초대하고 함께 선물을 준비해보세요!
                        </p>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/friends/invite">친구 초대하기</Link>
                        </Button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-4 py-6">
            <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-bold">📋 친구들의 위시리스트</h2>
                <Link href="/friends" className="flex items-center text-xs text-muted-foreground hover:text-primary">
                    더보기 <ChevronRight className="h-3 w-3" />
                </Link>
            </div>

            <div className="space-y-3 px-4">
                {friendsWishlists.map((item) => {
                    const topItems = item.previewItems.slice(0, 3);
                    const itemCountText =
                        topItems.length > 0
                            ? `${topItems[0].product.name}${item.wishlist.itemCount > 1 ? ` 외 ${item.wishlist.itemCount - 1}개` : ''}`
                            : '아직 아이템이 없어요';

                    return (
                        <Card key={item.member.id} className="flex items-center justify-between p-4 hover:bg-accent/5 transition-colors">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Avatar>
                                    <AvatarImage src={item.member.avatarUrl || undefined} />
                                    <AvatarFallback>{(item.member.nickname || '알')[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold truncate">
                                        {item.member.nickname}의 위시리스트
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {itemCountText}
                                    </p>
                                </div>
                            </div>
                            <Button variant="secondary" size="sm" asChild className="shrink-0">
                                <Link href={`/wishlist/${item.member.id}`}>구경하기</Link>
                            </Button>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
}

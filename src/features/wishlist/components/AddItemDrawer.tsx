'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Search } from 'lucide-react';

export function AddItemDrawer({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const handleNavigateToProducts = () => {
        router.push('/products');
    };

    return (
        <Drawer>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>위시리스트에 추가</DrawerTitle>
                        <DrawerDescription>
                            원하는 상품을 검색하고 위시리스트에 추가하세요
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="p-4 pb-0 space-y-3">
                        <Button
                            onClick={handleNavigateToProducts}
                            className="w-full h-14 text-base"
                            size="lg"
                        >
                            <Search className="mr-2 h-5 w-5" />
                            상품 검색하기
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    또는
                                </span>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground text-center py-2">
                            외부 링크를 통한 상품 추가는 준비중입니다
                        </p>
                    </div>

                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">취소</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Construction, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ComingSoonProps {
    title: string;
}

export function ComingSoon({ title }: ComingSoonProps) {
    const router = useRouter();

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="flex justify-center">
                    <div className="rounded-full bg-muted p-4">
                        <Construction className="h-12 w-12 text-muted-foreground" strokeWidth={1} />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {title}
                    </h1>
                    <p className="text-muted-foreground">
                        현재 준비 중인 페이지입니다.
                        <br />
                        더 나은 서비스로 곧 찾아뵙겠습니다.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild className="gap-2">
                        <Link href="/">
                            <Home className="h-4 w-4" strokeWidth={1.5} />
                            홈으로
                        </Link>
                    </Button>
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
                        이전 페이지
                    </Button>
                </div>
            </div>
        </div>
    );
}

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { Funding } from '@/types/funding';
import { productImages } from '@/mocks/data/productImages';

interface ShowcaseProductProps {
    funding: Funding;
    onParticipate: () => void;
}

export function ShowcaseProduct({ funding, onParticipate }: ShowcaseProductProps) {
    const { product } = funding;
    const progress = Math.min((funding.currentAmount / funding.targetAmount) * 100, 100);

    return (
        <section className="py-32 bg-[#F4F4F4]">
            <div className="max-w-screen-lg mx-auto px-6">
                <div className="bg-white p-8 md:p-12 shadow-sm flex flex-col md:flex-row gap-12 items-center">
                    <div className="relative w-full md:w-1/2 aspect-square">
                        <Image
                            src={productImages[product.imageUrl as keyof typeof productImages] || product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                                    {funding.recipient.nickname}님을 위한 펀딩
                                </h3>
                                <h2 className="text-3xl font-bold tracking-tight">
                                    {product.name}
                                </h2>
                                <p className="text-xl font-medium mt-2">
                                    {product.price.toLocaleString()}원
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold text-primary">{Math.round(progress)}% 달성</span>
                                    <span className="text-muted-foreground">
                                        {funding.currentAmount.toLocaleString()}원 모임
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-secondary overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-500 ease-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground text-right">
                                    목표 금액 {funding.targetAmount.toLocaleString()}원
                                </p>
                            </div>

                            <Button
                                size="lg"
                                className="w-full h-14 text-lg rounded-none mt-4"
                                onClick={onParticipate}
                            >
                                <ShoppingBag className="w-5 h-5 mr-2" />
                                펀딩 참여하기
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Share, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductImages } from '@/features/product/components/ProductImages';
import { ProductInfo } from '@/features/product/components/ProductInfo';
import { AddToWishlistButton } from '@/features/product/components/AddToWishlistButton';
import { useProductDetail } from '@/features/product/hooks/useProductDetail';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: product, isLoading, error } = useProductDetail(params.id);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-4xl mb-4">😢</div>
        <p className="text-gray-600 mb-4">상품을 불러올 수 없습니다</p>
        <Button onClick={() => router.back()}>돌아가기</Button>
      </div>
    );
  }

  if (isLoading || !product) {
    return (
      <div className="flex flex-col h-screen">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between p-4 border-b">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-20" />
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-1/3" />
          </div>
          <Skeleton className="h-32 w-full" />
        </div>

        {/* Bottom CTA Skeleton */}
        <div className="border-t p-4 bg-white">
          <div className="flex gap-2">
            <Skeleton className="h-12 w-16" />
            <Skeleton className="h-12 flex-1" />
          </div>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `${product.name} - ₩${product.price.toLocaleString()}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('링크가 복사되었습니다');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">상품 상세</h1>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
          >
            <Share className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Product Images */}
          <ProductImages
            images={product.images || [product.imageUrl]}
            alt={product.name}
          />

          {/* Product Info */}
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="border-t p-4 bg-white sticky bottom-0">
        <div className="flex gap-2">
          <AddToWishlistButton
            productId={product.id}
            productName={product.name}
            variant="icon"
          />
          <AddToWishlistButton
            productId={product.id}
            productName={product.name}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}

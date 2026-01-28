'use client';

import { useRouter } from 'next/navigation';
import { ProductCard } from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/types/product';

export interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
}

/**
 * ProductList - Grid layout for products with loading skeleton
 * 2-column grid on mobile, responsive
 */
export function ProductList({ products, isLoading }: ProductListProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-4">📦</div>
        <p className="text-gray-600 mb-2">검색 결과가 없습니다</p>
        <p className="text-sm text-gray-500">다른 검색어를 시도해보세요</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={() => router.push(`/products/${product.id}`)}
        />
      ))}
    </div>
  );
}

'use client';

import { Suspense } from 'react';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductSearchHeader } from '@/features/product/components/ProductSearchHeader';
import { ProductFilters } from '@/features/product/components/ProductFilters';
import { ProductList } from '@/features/product/components/ProductList';
import { useInfiniteProducts, useInfiniteSearchProducts } from '@/features/product/hooks/useProducts';
import { Loader2 } from 'lucide-react';
import type { ProductQueryParams } from '@/types/product';

function ProductSearchContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const category = searchParams.get('category') || undefined;
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const sort = (searchParams.get('sort') as ProductQueryParams['sort']) || 'popular';

  // Use search hook if query exists, otherwise use products hook
  const searchEnabled = !!searchQuery;

  const searchResult = useInfiniteSearchProducts({
    q: searchQuery,
    category,
    size: 20,
  });

  const productsResult = useInfiniteProducts({
    category,
    minPrice,
    maxPrice,
    sort,
    size: 20,
  });

  const result = searchEnabled ? searchResult : productsResult;
  const products = result.data?.pages.flatMap((page) => page.items) || [];
  const isLoading = result.isLoading;
  const hasNextPage = result.hasNextPage;
  const isFetchingNextPage = result.isFetchingNextPage;

  // Intersection Observer for infinite scroll
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          result.fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, result]);

  return (
    <div className="flex flex-col h-screen">
      <ProductSearchHeader />

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4">
          {/* Filter Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              {searchQuery && (
                <span className="font-medium">
                  &quot;{searchQuery}&quot; 검색 결과{' '}
                </span>
              )}
              {result.data?.pages[0]?.page && (
                <span>
                  ({result.data.pages[0].page.totalElements}개)
                </span>
              )}
            </div>
            <ProductFilters />
          </div>

          {/* Product List */}
          <ProductList products={products} isLoading={isLoading} />

          {/* Load More Trigger */}
          <div ref={loadMoreRef} className="py-8 flex justify-center">
            {isFetchingNextPage ? (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            ) : hasNextPage ? (
              <div className="h-4" /> // Ghost element to trigger observer
            ) : products.length > 0 ? (
              <p className="text-sm text-muted-foreground">모든 상품을 불러왔습니다.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <ProductSearchContent />
    </Suspense>
  );
}

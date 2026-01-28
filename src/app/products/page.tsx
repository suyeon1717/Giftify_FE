'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductSearchHeader } from '@/features/product/components/ProductSearchHeader';
import { ProductFilters } from '@/features/product/components/ProductFilters';
import { ProductList } from '@/features/product/components/ProductList';
import { useProducts, useSearchProducts } from '@/features/product/hooks/useProducts';
import type { ProductQueryParams, ProductSearchParams } from '@/types/product';

function ProductSearchContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const category = searchParams.get('category') || undefined;
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const sort = (searchParams.get('sort') as ProductQueryParams['sort']) || 'popular';
  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 0;

  // Use search hook if query exists, otherwise use products hook
  const searchEnabled = !!searchQuery;

  const searchResult = useSearchProducts({
    q: searchQuery,
    category,
    page,
    size: 20,
  });

  const productsResult = useProducts({
    category,
    minPrice,
    maxPrice,
    sort,
    page,
    size: 20,
  });

  const result = searchEnabled ? searchResult : productsResult;
  const products = result.data?.items || [];
  const isLoading = result.isLoading;

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
              {result.data?.page && (
                <span>
                  ({result.data.page.totalElements}개)
                </span>
              )}
            </div>
            <ProductFilters />
          </div>

          {/* Product List */}
          <ProductList products={products} isLoading={isLoading} />

          {/* TODO: Add pagination or infinite scroll */}
          {result.data?.page?.hasNext && (
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set('page', String(page + 1));
                  window.history.pushState(null, '', `?${params.toString()}`);
                }}
                className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700"
              >
                더보기
              </button>
            </div>
          )}
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

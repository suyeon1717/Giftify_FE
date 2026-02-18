'use client';

import { Suspense } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import { ProductList } from '@/features/product/components/ProductList';
import { useInfiniteProducts, useInfiniteSearchProducts } from '@/features/product/hooks/useProducts';
import { Loader2, X } from 'lucide-react';
import type { ProductQueryParams } from '@/types/product';
import { cn } from '@/lib/utils';

// Categories for sidebar filter
const CATEGORIES = [
  { label: '전체', value: '' },
  { label: '전자기기', value: 'ELECTRONICS' },
  { label: '뷰티', value: 'BEAUTY' },
  { label: '패션', value: 'FASHION' },
  { label: '리빙', value: 'LIVING' },
  { label: '식품', value: 'FOODS' },
  { label: '완구', value: 'TOYS' },
  { label: '아웃도어', value: 'OUTDOOR' },
  { label: '반려동물', value: 'PET' },
  { label: '주방', value: 'KITCHEN' },
];

// Sort options
const SORT_OPTIONS = [
  { label: '추천순', value: 'RELEVANCE' },
  { label: '신상품순', value: 'LATEST' },
  { label: '낮은가격순', value: 'PRICE_ASC' },
  { label: '높은가격순', value: 'PRICE_DESC' },
];

function ProductSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const sort = (searchParams.get('sort') as ProductQueryParams['sort']) || 'RELEVANCE';

  const [customMinPrice, setCustomMinPrice] = useState('');
  const [customMaxPrice, setCustomMaxPrice] = useState('');

  const applyCustomPrice = () => {
    updateMultipleParams({
      minPrice: customMinPrice,
      maxPrice: customMaxPrice,
    });
  };

  const searchEnabled = !!searchQuery;

  const searchResult = useInfiniteSearchProducts({
    q: searchQuery,
    category: category || undefined,
    size: 20,
  });

  const productsResult = useInfiniteProducts({
    category: category || undefined,
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
  const totalElements = result.data?.pages[0]?.page?.totalElements || 0;

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

  // Update URL params
  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const updateMultipleParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearSearch = () => {
    router.push('/products');
  };

  return (
    <AppShell headerVariant="main">
      <div className="max-w-screen-2xl mx-auto px-8">
        {/* Curated Header Section */}
        {!searchQuery && (
          <div className="py-12 border-b border-gray-100 mb-8">
            <h1 className="text-4xl font-black tracking-tighter mb-4 uppercase">Product Curation</h1>
            <p className="text-sm text-gray-500 max-w-lg leading-relaxed">
              취향을 담은 특별한 발견. 기프티파이가 제안하는 테마별 상품들을 탐색하고 
              당신만의 위시리스트를 완성해보세요.
            </p>
            
            {/* Theme Tags */}
            <div className="flex gap-3 mt-8 overflow-x-auto no-scrollbar pb-2">
              {['NEW', 'BEST', 'GIFT GUIDE', 'OFFICE', 'TECH', 'HOME'].map(tag => (
                <button key={tag} className="px-5 py-2 border border-black text-[10px] font-bold hover:bg-black hover:text-white transition-colors">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex min-h-screen gap-12">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-40 flex-shrink-0 pt-4 sticky top-40 h-[calc(100vh-10rem)] overflow-y-auto no-scrollbar">
            {/* Categories */}
            <div className="mb-12">
              <h3 className="text-[10px] font-black text-black mb-6 uppercase tracking-widest">
                Category
              </h3>
              <ul className="space-y-3">
                {CATEGORIES.map((cat) => (
                  <li key={cat.value}>
                    <button
                      onClick={() => updateParams('category', cat.value)}
                      className={cn(
                        'text-xs transition-opacity hover:opacity-60 text-left w-full',
                        category === cat.value ? 'font-black text-black underline underline-offset-4' : 'text-gray-400 font-medium'
                      )}
                    >
                      {cat.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div className="mb-12">
              <h3 className="text-[10px] font-black text-black mb-6 uppercase tracking-widest">
                Price
              </h3>
              {/* Custom Price Input */}
              <div className="flex items-center gap-1 mb-4">
                <input
                  type="number"
                  placeholder="최소"
                  value={customMinPrice}
                  onChange={(e) => setCustomMinPrice(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyCustomPrice()}
                  className="flex-1 min-w-0 px-2 py-1.5 border border-gray-200 text-[10px] text-center focus:outline-none focus:border-black"
                />
                <span className="text-[10px] text-gray-300">—</span>
                <input
                  type="number"
                  placeholder="최대"
                  value={customMaxPrice}
                  onChange={(e) => setCustomMaxPrice(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyCustomPrice()}
                  className="flex-1 min-w-0 px-2 py-1.5 border border-gray-200 text-[10px] text-center focus:outline-none focus:border-black"
                />
              </div>
              <button
                onClick={applyCustomPrice}
                className="w-full py-1.5 mb-5 border border-black text-[10px] font-bold hover:bg-black hover:text-white transition-colors"
              >
                적용
              </button>
              <ul className="space-y-3">
                {[
                  { label: '전체', min: '', max: '' },
                  { label: '~5만원', min: '', max: '50000' },
                  { label: '5~10만원', min: '50000', max: '100000' },
                  { label: '10만원~', min: '100000', max: '' },
                ].map((range) => {
                  const isActive = range.label === '전체'
                    ? (!minPrice && !maxPrice)
                    : (range.min === (minPrice?.toString() || '') && range.max === (maxPrice?.toString() || ''));

                  return (
                    <li key={range.label}>
                      <button
                        onClick={() => {
                          setCustomMinPrice('');
                          setCustomMaxPrice('');
                          updateMultipleParams({ minPrice: range.min, maxPrice: range.max });
                        }}
                        className={cn(
                          'text-xs transition-opacity hover:opacity-60 text-left w-full',
                          isActive ? 'font-black text-black underline underline-offset-4' : 'text-gray-400 font-medium'
                        )}
                      >
                        {range.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 pb-20">
            {/* Toolbar Area */}
            <div className="flex items-center justify-between mb-8 pt-4">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black tracking-widest">
                  {totalElements.toLocaleString()} ITEMS
                </span>
                {searchQuery && (
                  <div className="flex items-center gap-2 bg-black text-white px-3 py-1 text-[10px] font-bold">
                    <span>"{searchQuery}"</span>
                    <button onClick={clearSearch}>
                      <X className="h-3 w-3" strokeWidth={1.5} />
                    </button>
                  </div>
                )}
                {(minPrice || maxPrice) && (
                  <div className="flex items-center gap-2 bg-black text-white px-3 py-1 text-[10px] font-bold">
                    <span>{minPrice ? `${minPrice.toLocaleString()}원` : '0원'} ~ {maxPrice ? `${maxPrice.toLocaleString()}원` : ''}</span>
                    <button onClick={() => {
                      setCustomMinPrice('');
                      setCustomMaxPrice('');
                      updateMultipleParams({ minPrice: '', maxPrice: '' });
                    }}>
                      <X className="h-3 w-3" strokeWidth={1.5} />
                    </button>
                  </div>
                )}
              </div>

              {/* Sort Options */}
              <div className="flex items-center gap-6">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateParams('sort', option.value)}
                    className={cn(
                      'text-[10px] font-bold tracking-tight transition-colors hidden sm:block',
                      sort === option.value ? 'text-black' : 'text-gray-300 hover:text-gray-500'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <ProductList products={products} isLoading={isLoading} />

            {/* Load More */}
            <div ref={loadMoreRef} className="py-20 flex justify-center">
              {isFetchingNextPage ? (
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <Loader2 className="h-3 w-3 animate-spin" strokeWidth={1.5} />
                  LOADING...
                </div>
              ) : hasNextPage ? (
                <div className="h-4" />
              ) : products.length > 0 ? (
                <p className="text-[10px] font-black tracking-widest text-gray-300">END OF PRODUCTS</p>
              ) : null}
            </div>

            {/* Footer */}
            <Footer />
          </main>
        </div>
      </div>
    </AppShell>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <ProductSearchContent />
    </Suspense>
  );
}

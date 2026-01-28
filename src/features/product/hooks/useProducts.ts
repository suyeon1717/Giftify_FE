import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/keys';
import { getProducts, searchProducts } from '@/lib/api/products';
import type { ProductQueryParams, ProductSearchParams } from '@/types/product';

/**
 * Hook to fetch products with optional filters
 */
export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: queryKeys.products(params),
    queryFn: () => getProducts(params),
  });
}

/**
 * Hook to fetch products with infinite scroll support
 */
export function useInfiniteProducts(params: Omit<ProductQueryParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: queryKeys.products({ ...params, type: 'infinite' }),
    queryFn: ({ pageParam = 0 }) => getProducts({ ...params, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.page.hasNext ? lastPage.page.page + 1 : undefined,
  });
}

/**
 * Hook to search products by keyword
 */
export function useSearchProducts(params: ProductSearchParams) {
  return useQuery({
    queryKey: queryKeys.products(params),
    queryFn: () => searchProducts(params),
    enabled: !!params.q,
  });
}

/**
 * Hook to search products with infinite scroll support
 */
export function useInfiniteSearchProducts(params: Omit<ProductSearchParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: queryKeys.products({ ...params, type: 'infinite' }),
    queryFn: ({ pageParam = 0 }) => searchProducts({ ...params, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.page.hasNext ? lastPage.page.page + 1 : undefined,
    enabled: !!params.q,
  });
}

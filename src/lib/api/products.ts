import { apiClient } from './client';
import type {
  Product,
  ProductDetail,
  ProductListResponse,
  ProductQueryParams,
  ProductSearchParams,
  PopularProductsResponse
} from '@/types/product';

// Alias for backward compatibility
export type ProductsParams = ProductQueryParams;
export type SearchProductsParams = ProductSearchParams;

export async function getProducts(params?: ProductsParams): Promise<ProductListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.category) queryParams.append('category', params.category);
  if (params?.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
  if (params?.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
  if (params?.sort) queryParams.append('sort', params.sort);
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/api/products?${queryString}` : '/api/products';

  return apiClient.get<ProductListResponse>(endpoint);
}

export async function searchProducts(params: SearchProductsParams): Promise<ProductListResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append('q', params.q);
  if (params.category) queryParams.append('category', params.category);
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());

  return apiClient.get<ProductListResponse>(`/api/products/search?${queryParams.toString()}`);
}

export async function getProduct(productId: string): Promise<ProductDetail> {
  return apiClient.get<ProductDetail>(`/api/products/${productId}`);
}

export async function getPopularProducts(limit?: number): Promise<PopularProductsResponse> {
  const queryParams = new URLSearchParams();
  if (limit !== undefined) queryParams.append('limit', limit.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/api/products/popular?${queryString}` : '/api/products/popular';

  return apiClient.get<PopularProductsResponse>(endpoint);
}

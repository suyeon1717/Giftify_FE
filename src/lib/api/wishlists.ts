import { apiClient } from './client';
import type {
  Wishlist,
  WishItem,
  WishlistVisibility,
  WishItemCreateRequest,
  FriendWishlistListResponse
} from '@/types/wishlist';

export interface WishlistVisibilityUpdateRequest {
  visibility: WishlistVisibility;
}

export async function getMyWishlist(): Promise<Wishlist> {
  return apiClient.get<Wishlist>('/api/wishlists/me');
}

export async function getWishlist(memberId: string): Promise<Wishlist> {
  return apiClient.get<Wishlist>(`/api/wishlists/${memberId}`);
}

export async function addWishlistItem(data: WishItemCreateRequest): Promise<WishItem> {
  return apiClient.post<WishItem>('/api/wishlists/items', data);
}

export async function removeWishlistItem(itemId: string): Promise<void> {
  return apiClient.delete<void>(`/api/wishlists/items/${itemId}`);
}

export async function updateWishlistVisibility(data: WishlistVisibilityUpdateRequest): Promise<Wishlist> {
  return apiClient.patch<Wishlist>('/api/wishlists/visibility', data);
}

export async function getFriendsWishlists(limit?: number): Promise<FriendWishlistListResponse> {
  const queryParams = new URLSearchParams();
  if (limit !== undefined) queryParams.append('limit', limit.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/api/friends/wishlists?${queryString}` : '/api/friends/wishlists';

  return apiClient.get<FriendWishlistListResponse>(endpoint);
}

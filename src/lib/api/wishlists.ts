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

interface WishlistInfoResponse {
  id: string;
  memberId: string;
  visibility: WishlistVisibility;
  // Add other fields if necessary
}

export async function getMyWishlist(): Promise<Wishlist> {
  // Fetch full wishlist including items from standard endpoint
  return apiClient.get<Wishlist>('/api/wishlists/me');
}

export async function getWishlist(memberId: string): Promise<Wishlist> {
  // Fetch full wishlist including items from standard endpoint
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
  const endpoint = queryString ? `/api/v2/friends/wishlists?${queryString}` : '/api/v2/friends/wishlists';

  return apiClient.get<FriendWishlistListResponse>(endpoint);
}

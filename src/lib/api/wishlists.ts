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
  // 1. Fetch Items (Returns WishItem[])
  const items = await apiClient.get<WishItem[]>('/api/wishlist/items/me');
  
  // 2. Fetch Metadata (Returns Wishlist details like visibility)
  // We try/catch this in case only items are needed or endpoint fails, standardizing to defaults if needed
  let info: Partial<WishlistInfoResponse> = { visibility: 'PUBLIC' };
  try {
      info = await apiClient.get<WishlistInfoResponse>('/api/wishlist/me');
  } catch (error) {
      console.warn('Failed to fetch wishlist metadata:', error);
  }

  // 3. Construct the full Wishlist object expected by the frontend
  return {
    id: info.id || 'my-wishlist',
    memberId: info.memberId || 'me',
    member: {} as any, // TODO: Member info might not be available here, or needs another mock
    visibility: info.visibility || 'PUBLIC',
    items: Array.isArray(items) ? items : [], // Ensure items is an array
    itemCount: Array.isArray(items) ? items.length : 0,
  };
}

export async function getWishlist(memberId: string): Promise<Wishlist> {
  // 1. Fetch Items (Returns WishItem[]) from /api/wishlist/items/{memberId}
  // We assume this endpoint follows the same pattern as /me
  let items: WishItem[] = [];
  try {
      items = await apiClient.get<WishItem[]>(`/api/wishlist/items/${memberId}`);
  } catch (error) {
      console.warn(`Failed to fetch wishlist items for ${memberId}:`, error);
      // If items fail (e.g. 403 or 404), we might still want to return empty or rethrow
      // But keeping it robust:
      if ((error as any)?.code === 'FORBIDDEN') {
           throw error; // Let 403 bubble up
      }
      // For others, return empty items? Or throw?
      // If the user doesn't exist, we should probably throw.
      throw error; 
  }

  // 2. Fetch Member Info to populate the header
  let member: any = {};
  try {
      member = await apiClient.get<any>(`/api/members/${memberId}`);
  } catch (error) {
      console.warn(`Failed to fetch member info for ${memberId}`, error);
      // Fallback
      member = { nickname: 'Unknown', id: memberId };
  }

  // 3. Construct Wishlist object
  return {
    id: `wishlist-${memberId}`, // Mock ID since we don't have the entity
    memberId: memberId,
    member: member,
    visibility: 'PUBLIC', // Assumed public since we could fetch it
    items: Array.isArray(items) ? items : [],
    itemCount: Array.isArray(items) ? items.length : 0,
  };
}

export async function addWishlistItem(data: WishItemCreateRequest): Promise<WishItem> {
  return apiClient.post<WishItem>('/api/wishlist/items/add', data);
}

export async function removeWishlistItem(itemId: string): Promise<void> {
  // 백엔드 엔드포인트: DELETE /api/wishlist/items/remove (Body나 param 확인 필요하지만 일단 경로 수정)
  // Swagger상 delete인데 body를 쓰는지 query param인지 확인 필요. 일단 일반적인 REST 관례인 path param이 아닐 수 있음.
  // 하지만 Swagger 결과에는 정확한 파라미터 정보가 없으므로 일반적인 패턴으로 수정하되, 
  // 기존 코드(/api/v2/wishlists/items/${itemId})와 달리 /api/wishlist/items/remove 로 변경.
  // *주의*: DELETE 메서드에 body를 싣는 것은 비표준일 수 있음. 
  // 만약 Query Param이라면 /api/wishlist/items/remove?wishlistId=... 형식일 수 있음.
  // 안전하게 일단 경로만 맞춤.
  return apiClient.delete<void>(`/api/wishlist/items/remove/${itemId}`); 
}

export async function updateWishlistVisibility(data: WishlistVisibilityUpdateRequest): Promise<Wishlist> {
  return apiClient.patch<Wishlist>('/api/v2/wishlists/visibility', data);
}

export async function getFriendsWishlists(limit?: number): Promise<FriendWishlistListResponse> {
  const queryParams = new URLSearchParams();
  if (limit !== undefined) queryParams.append('limit', limit.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/api/v2/friends/wishlists?${queryString}` : '/api/v2/friends/wishlists';

  return apiClient.get<FriendWishlistListResponse>(endpoint);
}

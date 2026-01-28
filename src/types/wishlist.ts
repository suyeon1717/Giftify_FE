import { MemberPublic } from './member';
import { Product } from './product';

/**
 * Wishlist visibility settings
 * - PUBLIC: Visible to everyone
 * - FRIENDS_ONLY: Visible to friends only
 * - PRIVATE: Visible only to owner
 */
export type WishlistVisibility = 'PUBLIC' | 'FRIENDS_ONLY' | 'PRIVATE';

/**
 * Wish item status
 * - AVAILABLE: Can create funding
 * - IN_FUNDING: Funding in progress
 * - FUNDED: Funding completed
 */
export type WishItemStatus = 'AVAILABLE' | 'IN_FUNDING' | 'FUNDED';

/**
 * Wish item in a wishlist
 */
export interface WishItem {
    id: string;
    wishlistId: string;
    productId: string;
    product: Product;
    status: WishItemStatus;
    fundingId: string | null;
    createdAt: string;
}

/**
 * Member's wishlist with items
 */
export interface Wishlist {
    id: string;
    memberId: string;
    member: MemberPublic;
    visibility: WishlistVisibility;
    items: WishItem[];
    itemCount: number;
}

/**
 * Request body for creating a wish item
 */
export interface WishItemCreateRequest {
    productId: string;
}

/**
 * Friend's wishlist with preview items
 */
export interface FriendWishlistItem {
    member: MemberPublic;
    wishlist: Wishlist;
    previewItems: WishItem[];
}

/**
 * Response for friends' wishlists
 */
export interface FriendWishlistListResponse {
    items: FriendWishlistItem[];
}

import { Funding } from './funding';

/**
 * Shopping cart containing funding participation items
 */
export interface Cart {
    id: string;
    memberId: string;
    items: CartItem[];
    selectedCount: number;
    totalAmount: number;
}

/**
 * Cart item representing a funding participation
 */
export interface CartItem {
    id: string;
    cartId: string;
    fundingId: string;
    funding: Funding;
    amount: number;
    selected: boolean;
    isNewFunding: boolean;
    createdAt: string;
}

/**
 * Request body for creating a cart item
 * Either fundingId (for existing funding) or wishItemId (for new funding) must be provided
 */
export interface CartItemCreateRequest {
    fundingId?: string;
    wishItemId?: string;
    amount: number;
}

/**
 * Request body for updating a cart item
 */
export interface CartItemUpdateRequest {
    amount?: number;
    selected?: boolean;
}

import { PaginatedResponse } from './api';
import { Funding } from './funding';
import { Payment } from './payment';

/**
 * Order containing multiple funding participations
 */
export interface Order {
    id: string;
    memberId: string;
    totalAmount: number;
    itemCount: number;
    isPaid: boolean;
    createdAt: string;
}

/**
 * Order item representing a single funding participation in an order
 */
export interface OrderItem {
    id: string;
    orderId: string;
    fundingId: string;
    funding: Funding;
    amount: number;
}

/**
 * Detailed order information with items and payment
 */
export interface OrderDetail extends Order {
    items: OrderItem[];
    payment: Payment | null;
}

/**
 * Request body for creating an order
 */
export interface OrderCreateRequest {
    cartItemIds?: string[];
}

/**
 * Paginated list of orders
 */
export type OrderListResponse = PaginatedResponse<Order>;

import { PaginatedResponse } from './api';

// --- Backend V2 Order Types ---

/**
 * 결제 방법
 * @see PaymentMethod enum
 */
export type PaymentMethod = 'WALLET' | 'CARD' | 'TRANSFER';

/**
 * 주문 아이템 타입
 * @see OrderItemType enum
 */
export type OrderItemType = 'FUNDING_PENDING' | 'FUNDING' | 'GENERAL_PRODUCT';

/**
 * 주문 상태
 * @see OrderStatus enum
 */
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'FAILED';

/**
 * 주문 아이템 상태
 * @see OrderItemStatus enum
 */
export type OrderItemStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';

/**
 * Order summary for list views
 * @see OrderSummary.java
 */
export interface Order {
    id: string;
    orderNumber: string;
    quantity: number;
    totalAmount: number;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    createdAt: string;
    confirmedAt: string | null;
    cancelledAt: string | null;
}

/**
 * Order item detail
 * @see OrderItemDetail.java
 */
export interface OrderItem {
    id: string;
    targetId: string;
    orderItemType: OrderItemType;
    sellerId: string;
    receiverId: string;
    price: number;
    amount: number;
    status: OrderItemStatus;
    cancelledAt: string | null;
}

/**
 * Detailed order with items
 * @see OrderDetail.java
 */
export interface OrderDetail {
    order: Order;
    items: OrderItem[];
}

// --- Request Types ---

/**
 * 주문 아이템 요청 DTO
 * @see PlaceOrderItemRequest.java
 */
export interface PlaceOrderItemRequest {
    wishlistItemId: number;
    receiverId: number;
    amount: number;
    orderItemType: OrderItemType;
}

/**
 * 주문+결제 요청 DTO
 * @see PlaceOrderRequest.java
 */
export interface PlaceOrderRequest {
    items: PlaceOrderItemRequest[];
    method: PaymentMethod;
}

/**
 * 주문 생성 결과
 * @see PlaceOrderResult.java
 */
export interface PlaceOrderResult {
    orderId: string;
}

// --- Legacy types for backward compatibility ---

/**
 * @deprecated Use PlaceOrderRequest instead
 */
export interface OrderCreateRequest {
    cartItemIds?: string[];
}

/**
 * Paginated list of orders
 */
export type OrderListResponse = PaginatedResponse<Order>;

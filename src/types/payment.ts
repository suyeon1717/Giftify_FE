import { OrderDetail } from './order';

/**
 * Payment status enumeration
 * - PENDING: Payment pending
 * - PAID: Payment completed
 * - FAILED: Payment failed
 * - CANCELED: Payment canceled
 * - REFUNDED: Payment refunded
 * - RECEIVED: Funding received (accepted by recipient)
 */
export type PaymentStatus =
    | 'PENDING'
    | 'PAID'
    | 'FAILED'
    | 'CANCELED'
    | 'REFUNDED'
    | 'RECEIVED';

/**
 * Payment type enumeration
 */
export type PaymentType = 'FUNDING' | 'POINT_CHARGE';

/**
 * Payment method enumeration
 */
export type PaymentMethod = 'WALLET' | 'TOSS_PAYMENTS';

/**
 * Payment information
 */
export interface Payment {
    id: string;
    orderId: string;
    type: PaymentType;
    method: PaymentMethod;
    originAmount: number;
    paidAmount: number;
    status: PaymentStatus;
    createdAt: string;
}

/**
 * Request body for creating a payment
 */
export interface PaymentCreateRequest {
    orderId: string;
    method: PaymentMethod;
}

/**
 * Funding result after payment
 */
export interface FundingResult {
    fundingId: string;
    previousAmount: number;
    currentAmount: number;
    previousProgress: number;
    currentProgress: number;
    isAchieved: boolean;
}

/**
 * Payment result with order and wallet information
 */
export interface PaymentResult {
    payment: Payment;
    order: OrderDetail;
    walletBalance: number;
    fundingResults: FundingResult[];
}

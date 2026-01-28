import { PaginatedResponse } from './api';

/**
 * Transaction type enumeration
 * - CHARGE: Wallet charge (deposit)
 * - PAYMENT: Payment (withdrawal)
 * - REFUND: Refund (deposit)
 */
export type TransactionType = 'CHARGE' | 'PAYMENT' | 'REFUND';

/**
 * Wallet information
 */
export interface Wallet {
    id: string;
    memberId: string;
    balance: number;
}

/**
 * Request body for wallet charge
 */
export interface WalletChargeRequest {
    amount: number;
}

/**
 * Response for wallet charge request
 */
export interface WalletChargeResponse {
    chargeId: string;
    paymentUrl: string;
    amount: number;
}

/**
 * Wallet transaction record
 */
export interface WalletTransaction {
    id: string;
    type: TransactionType;
    amount: number;
    balanceAfter: number;
    description: string;
    relatedId: string | null;
    createdAt: string;
}

/**
 * Paginated list of wallet transactions
 */
export type WalletHistoryResponse = PaginatedResponse<WalletTransaction>;

/**
 * Query parameters for wallet history
 */
export interface WalletHistoryQueryParams {
    type?: TransactionType;
    page?: number;
    size?: number;
}

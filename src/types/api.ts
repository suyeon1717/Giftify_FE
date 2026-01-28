/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
    data: T;
    message?: string;
}

/**
 * Standard error response
 */
export interface ErrorResponse {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

/**
 * Pagination metadata
 */
export interface PageInfo {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
    content: T[];
    items: T[];
    page: PageInfo;
}

/**
 * Query parameters for paginated requests
 */
export interface PageParams {
    page?: number;
    size?: number;
    sort?: string;
}
import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query';
import { ApiError } from '@/lib/api/client';

/**
 * Determines if an error is retryable
 */
function shouldRetry(failureCount: number, error: unknown): boolean {
    // Don't retry after 3 attempts
    if (failureCount >= 3) return false;

    // Don't retry client errors (4xx) except 408 (timeout) and 429 (rate limit)
    if (error instanceof ApiError) {
        if (error.status >= 400 && error.status < 500) {
            return error.status === 408 || error.status === 429;
        }
    }

    // Retry network errors and server errors
    return true;
}

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                retry: shouldRetry,
                retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
                refetchOnWindowFocus: false,
            },
            mutations: {
                retry: shouldRetry,
                retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            },
            dehydrate: {
                // per default, only successful queries are included, errors are omitted
                shouldDehydrateQuery: (query) =>
                    defaultShouldDehydrateQuery(query) ||
                    query.state.status === 'pending',
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
    if (typeof window === 'undefined') {
        // Server: always make a new query client
        return makeQueryClient();
    } else {
        // Browser: make a new query client if we don't already have one
        if (!browserQueryClient) browserQueryClient = makeQueryClient();
        return browserQueryClient;
    }
}

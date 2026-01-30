import { toast } from 'sonner';

const BASE_URL = '/api/proxy';

export class ApiError extends Error {
    code: string;
    details?: unknown;

    constructor(message: string, code: string, details?: unknown) {
        super(message);
        this.code = code;
        this.details = details;
        this.name = 'ApiError';
    }
}

interface RequestConfig extends RequestInit {
    token?: string;
}

async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { token, headers, ...customConfig } = config;

    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...customConfig,
        headers: {
            ...defaultHeaders,
            ...headers,
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        // Handle specific error codes if needed
        const errorMessage = data.message || 'Something went wrong';
        const errorCode = data.code || 'UNKNOWN_ERROR';

        // Optional: Global error toast for specific critical errors
        // toast.error(errorMessage);

        throw new ApiError(errorMessage, errorCode, data.details);
    }

    return data as T;
}

export const apiClient = {
    get: <T>(endpoint: string, config?: RequestConfig) => request<T>(endpoint, { ...config, method: 'GET' }),
    post: <T>(endpoint: string, body: unknown, config?: RequestConfig) =>
        request<T>(endpoint, { ...config, method: 'POST', body: JSON.stringify(body) }),
    put: <T>(endpoint: string, body: unknown, config?: RequestConfig) =>
        request<T>(endpoint, { ...config, method: 'PUT', body: JSON.stringify(body) }),
    patch: <T>(endpoint: string, body: unknown, config?: RequestConfig) =>
        request<T>(endpoint, { ...config, method: 'PATCH', body: JSON.stringify(body) }),
    delete: <T>(endpoint: string, config?: RequestConfig) =>
        request<T>(endpoint, { ...config, method: 'DELETE' }),
};
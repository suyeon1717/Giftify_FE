import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../ProductCard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the API and query client prefetch
const mockPrefetchQuery = vi.fn();
vi.mock('@tanstack/react-query', async () => {
    const actual = await vi.importActual('@tanstack/react-query');
    return {
        ...actual,
        useQueryClient: () => ({
            prefetchQuery: mockPrefetchQuery,
        }),
    };
});

const mockProduct = {
    id: 'prod-1',
    name: 'Test Product',
    price: 10000,
    imageUrl: 'https://example.com/image.jpg',
    status: 'ON_SALE' as const,
    brandName: 'Test Brand',
};

describe('ProductCard', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient();
        vi.clearAllMocks();
    });

    it('renders product information correctly', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <ProductCard product={mockProduct} />
            </QueryClientProvider>
        );

        expect(screen.getByText('Test Product')).toBeDefined();
        expect(screen.getByText(/10,000.*원/)).toBeDefined();
    });

    it('triggers prefetch on mouse enter', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <ProductCard product={mockProduct} />
            </QueryClientProvider>
        );

        const card = screen.getByText('Test Product').closest('.cursor-pointer');
        if (!card) throw new Error('Card not found');

        fireEvent.mouseEnter(card);

        expect(mockPrefetchQuery).toHaveBeenCalledWith(
            expect.objectContaining({
                queryKey: ['products', 'prod-1'],
            })
        );
    });

    it('calls onClick when clicked', () => {
        const handleClick = vi.fn();
        render(
            <QueryClientProvider client={queryClient}>
                <ProductCard product={mockProduct} onClick={handleClick} />
            </QueryClientProvider>
        );

        fireEvent.click(screen.getByText('Test Product'));
        expect(handleClick).toHaveBeenCalled();
    });
});

import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import { describe, it, expect, vi } from 'vitest';
import ReviewsPage from '@/app/reviews/page';

// Mock dependencies
vi.mock('@/components/layout/AppShell', () => ({
    AppShell: ({ children }: { children: React.ReactNode }) => <div data-testid="app-shell">{children}</div>,
}));

vi.mock('@/components/layout/Footer', () => ({
    Footer: () => <div data-testid="footer">Footer</div>,
}));

vi.mock('next/image', () => ({
    default: (props: any) => <img {...props} alt={props.alt} />,
}));

// Mock Sheet components from shadcn/ui
vi.mock('@/components/ui/sheet', () => ({
    Sheet: ({ open, onOpenChange, children }: any) => (
        open ? <div data-testid="sheet" onClick={() => onOpenChange(false)}>{children}</div> : null
    ),
    SheetContent: ({ children }: any) => <div>{children}</div>,
    SheetHeader: ({ children }: any) => <div>{children}</div>,
    SheetTitle: ({ children }: any) => <div>{children}</div>,
}));

describe('ReviewsPage', () => {
    it('renders reviews grid and title', () => {
        render(<ReviewsPage />);

        expect(screen.getByText('Review Snap')).toBeInTheDocument();
        expect(screen.getByText('All')).toBeInTheDocument();
        expect(screen.getByText('Photo Best')).toBeInTheDocument();

        // Should render multiple review images (mocked as imgs)
        const images = screen.getAllByRole('img');
        expect(images.length).toBeGreaterThan(0);
    });

    it('opens review detail slide when a review is clicked', async () => {
        render(<ReviewsPage />);

        // Find a review card (the first image usually belongs to a review card in this mock setup)
        // Since we mocked next/image as img, we look for an image that is part of a review
        const reviewImages = screen.getAllByAltText(/Review by User1/i);
        const reviewImage = reviewImages[0];

        fireEvent.click(reviewImage);

        await waitFor(() => {
            // Check if Sheet content appears. We check for content specific to the selected review
            // Since we clicked the first one (User1), we expect User1 info to be visible in the sheet mock
            // Note: Sheet mock renders children when open is true.
            expect(screen.getByTestId('sheet')).toBeInTheDocument();
        });

        // Check for details inside the sheet
        expect(screen.getByText('도움이 돼요')).toBeInTheDocument();
        expect(screen.getByText('상품 보러가기')).toBeInTheDocument();
    });
});

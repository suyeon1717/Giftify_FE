import { render, screen } from '@/test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ParticipateModal } from '../ParticipateModal';
import type { Funding } from '@/types/funding';

// Mock UI components that might cause issues in test environment
vi.mock('@/components/ui/dialog', () => ({
    Dialog: ({ open, children }: any) => (open ? <div>{children}</div> : null),
    DialogContent: ({ children }: any) => <div>{children}</div>,
    DialogHeader: ({ children }: any) => <div data-testid="dialog-header">{children}</div>,
    DialogTitle: ({ children }: any) => <h2>{children}</h2>,
    DialogDescription: ({ children }: any) => <p>{children}</p>,
    DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

// Setup mock for toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock the useFundingMutations hook
const mockMutate = vi.fn();
vi.mock('@/features/funding/hooks/useFundingMutations', () => ({
    useParticipateFunding: () => ({
        mutate: mockMutate,
        isPending: false,
    }),
}));

describe('ParticipateModal Component', () => {
    const mockFunding: Funding = {
        id: 'f1',
        wishItemId: 'wi-1',
        organizerId: 'user-2',
        organizer: { id: 'user-2', nickname: 'Jane', avatarUrl: '' },
        recipientId: 'user-1',
        recipient: { id: 'user-1', nickname: 'John', avatarUrl: '' },
        product: { id: 'p1', name: 'Test Funding Item', price: 100000, imageUrl: '', status: 'ON_SALE' as const },
        targetAmount: 100000,
        currentAmount: 50000,
        status: 'IN_PROGRESS',
        participantCount: 3,
        expiresAt: '2026-02-28T00:00:00Z',
        createdAt: '2026-01-01T00:00:00Z',
    };

    const mockOnOpenChange = vi.fn();
    const mockOnSuccess = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('GIVEN user opens the modal, THEN it should display funding product name', () => {
        render(
            <ParticipateModal
                open={true}
                onOpenChange={mockOnOpenChange}
                funding={mockFunding}
                onSuccess={mockOnSuccess}
            />
        );

        expect(screen.getByText('Test Funding Item')).toBeInTheDocument();
        expect(screen.getByText('펀딩 참여하기')).toBeInTheDocument();
    });

    it('GIVEN funding progress, THEN it should display remaining amount text', () => {
        render(
            <ParticipateModal
                open={true}
                onOpenChange={mockOnOpenChange}
                funding={mockFunding}
                onSuccess={mockOnSuccess}
            />
        );

        // Should show remaining amount text
        expect(screen.getByText(/남은 목표 금액/)).toBeInTheDocument();
    });

    it('GIVEN user enters 0 amount, THEN submit button should be disabled', () => {
        render(
            <ParticipateModal
                open={true}
                onOpenChange={mockOnOpenChange}
                funding={mockFunding}
                onSuccess={mockOnSuccess}
            />
        );

        const submitBtn = screen.getByRole('button', { name: /참여하기/i });
        expect(submitBtn).toBeDisabled();
    });
});

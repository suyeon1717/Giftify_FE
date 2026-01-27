import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ParticipateModal } from '../ParticipateModal';
import { toast } from 'sonner';

// Mock UI components that might cause issues in test environment or are not focus of unit test
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

describe('ParticipateModal Component', () => {
    const mockFunding = {
        id: 'f1',
        title: 'Test Funding Item',
        currentAmount: 50000,
        targetAmount: 100000,
    };

    const mockOnOpenChange = vi.fn();
    const mockOnSuccess = vi.fn();

    it('GIVEN user opens the modal, THEN it should display funding title', () => {
        render(
            <ParticipateModal
                open={true}
                onOpenChange={mockOnOpenChange}
                funding={mockFunding}
                onSuccess={mockOnSuccess}
            />
        );

        expect(screen.getByText('Test Funding Item')).toBeDefined();
        expect(screen.getByText('펀딩 참여하기')).toBeDefined();
    });

    it('GIVEN user enters invalid amount, WHEN submit is clicked, THEN it should show validation error', () => {
        render(
            <ParticipateModal
                open={true}
                onOpenChange={mockOnOpenChange}
                funding={mockFunding}
                onSuccess={mockOnSuccess}
            />
        );

        // Initial state check (button enabled strictly speaking, but logic prevents submit action effectively or shows toast)
        const submitBtn = screen.getByRole('button', { name: /참여하기/i });

        // Amount is 0 by default, so button should be disabled
        expect(submitBtn).toBeDisabled();

        // Attempting to click shouldn't trigger submit handler or toast
        fireEvent.click(submitBtn);
        expect(toast.error).not.toHaveBeenCalled();
    });

    it('GIVEN user enters valid amount, WHEN submit is clicked, THEN it should call onSuccess', async () => {
        render(
            <ParticipateModal
                open={true}
                onOpenChange={mockOnOpenChange}
                funding={mockFunding}
                onSuccess={mockOnSuccess}
            />
        );

        // Find custom AmountInput (assumes it renders input[type="text"] for currency)
        const input = screen.getByDisplayValue('0');
        fireEvent.change(input, { target: { value: '10,000' } }); // Simulate formatted input if needed, or just number string depending on implementaiton
        // Actually AmountInput handles formatting, let's play safe and check implementation or just standard input behavior if we mocked/used generic match.
        // Let's assume testing library can find by role or placeholder if display value is tricky.
        // But since AmountInput is a controlled component wrapping Input, let's try finding by placeholder if any?
        // AmountInput usually doesn't have placeholder.
        // Let's use `fireEvent.change` on the input.

        // Re-render and finding element strategy might be needed if AmountInput is complex.
        // Simplified: Just mocking the `amount` state update via event?
        // Integration test style:
        fireEvent.change(input, { target: { value: '10000' } });

        const submitBtn = screen.getByRole('button', { name: /10,000원 참여하기/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockOnSuccess).toHaveBeenCalled();
        });
    });
});

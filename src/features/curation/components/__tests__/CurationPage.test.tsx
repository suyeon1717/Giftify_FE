import { render, screen, waitFor } from '@/test/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { CurationContent } from '@/app/curation/[themeId]/page';

// Mock dependencies
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

vi.mock('@/components/layout/AppShell', () => ({
    AppShell: ({ children }: { children: React.ReactNode }) => <div data-testid="app-shell">{children}</div>,
}));

vi.mock('@/components/layout/Footer', () => ({
    Footer: () => <div data-testid="footer">Footer</div>,
}));

// Mock Image to prevent issues with loading in tests
vi.mock('next/image', () => ({
    default: (props: any) => <img {...props} alt={props.alt} />,
}));

describe('CurationPage', () => {
    it('renders curation content correctly', async () => {
        render(<CurationContent themeId="birthday-men" />);

        await waitFor(() => {
            expect(screen.getByText('For Him: 센스 있는 생일 선물')).toBeInTheDocument();
            expect(screen.getByText('CURATION Vol.1')).toBeInTheDocument();
        });

        expect(screen.getByText("Editor's Note")).toBeInTheDocument();
        // Check for some products
        expect(screen.getByText('Leica Q2 Monochrom')).toBeInTheDocument();
        expect(screen.getByText('BOTTEGA VENETA')).toBeInTheDocument();
    });

    it('renders default theme if themeId matches nothing (fallback behavior in current impl)', async () => {
        render(<CurationContent themeId="invalid-id" />);

        await waitFor(() => {
            // Should fallback to default 'birthday-men' theme
            expect(screen.getByText('For Him: 센스 있는 생일 선물')).toBeInTheDocument();
        });
    });
});

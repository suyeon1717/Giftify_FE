import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import { ComingSoon } from '@/components/common/ComingSoon';

export default function SupportPage() {
    return (
        <AppShell headerTitle="1:1 문의" headerVariant="detail" hasBack showBottomNav={false}>
            <ComingSoon title="1:1 문의" />
            <Footer />
        </AppShell>
    );
}

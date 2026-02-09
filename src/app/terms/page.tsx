import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import { ComingSoon } from '@/components/common/ComingSoon';

export default function TermsPage() {
    return (
        <AppShell headerTitle="이용약관" headerVariant="detail" hasBack showBottomNav={false}>
            <ComingSoon title="이용약관" />
            <Footer />
        </AppShell>
    );
}

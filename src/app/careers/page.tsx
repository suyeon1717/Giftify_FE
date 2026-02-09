import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import { ComingSoon } from '@/components/common/ComingSoon';

export default function CareersPage() {
    return (
        <AppShell headerTitle="채용안내" headerVariant="detail" hasBack showBottomNav={false}>
            <ComingSoon title="채용안내" />
            <Footer />
        </AppShell>
    );
}

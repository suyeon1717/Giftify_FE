import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import { ComingSoon } from '@/components/common/ComingSoon';

export default function EventsPage() {
    return (
        <AppShell headerTitle="이벤트" headerVariant="detail" hasBack showBottomNav={false}>
            <ComingSoon title="이벤트" />
            <Footer />
        </AppShell>
    );
}

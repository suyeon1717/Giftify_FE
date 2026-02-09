import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import { ComingSoon } from '@/components/common/ComingSoon';

export default function OrdersCancelPage() {
    return (
        <AppShell headerTitle="취소/교환/반품" headerVariant="detail" hasBack showBottomNav={false}>
            <ComingSoon title="취소/교환/반품" />
            <Footer />
        </AppShell>
    );
}

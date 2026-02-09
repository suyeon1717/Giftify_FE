import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import { ComingSoon } from '@/components/common/ComingSoon';

export default function OrdersPage() {
    return (
        <AppShell headerTitle="주문배송" headerVariant="detail" hasBack showBottomNav={false}>
            <ComingSoon title="주문배송" />
            <Footer />
        </AppShell>
    );
}

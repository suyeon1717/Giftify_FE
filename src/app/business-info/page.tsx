import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import { ComingSoon } from '@/components/common/ComingSoon';

export default function BusinessInfoPage() {
    return (
        <AppShell headerTitle="사업자정보확인" headerVariant="detail" hasBack showBottomNav={false}>
            <ComingSoon title="사업자정보확인" />
            <Footer />
        </AppShell>
    );
}

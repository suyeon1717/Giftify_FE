import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import { ComingSoon } from '@/components/common/ComingSoon';

export default function AboutPage() {
    return (
        <AppShell headerTitle="회사소개" headerVariant="detail" hasBack showBottomNav={false}>
            <ComingSoon title="회사소개" />
            <Footer />
        </AppShell>
    );
}

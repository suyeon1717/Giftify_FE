import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import { ComingSoon } from '@/components/common/ComingSoon';

export default function YouthPolicyPage() {
    return (
        <AppShell headerTitle="청소년보호정책" headerVariant="detail" hasBack showBottomNav={false}>
            <ComingSoon title="청소년보호정책" />
            <Footer />
        </AppShell>
    );
}

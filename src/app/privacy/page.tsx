import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import { ComingSoon } from '@/components/common/ComingSoon';

export default function PrivacyPage() {
    return (
        <AppShell headerTitle="개인정보처리방침" headerVariant="detail" hasBack showBottomNav={false}>
            <ComingSoon title="개인정보처리방침" />
            <Footer />
        </AppShell>
    );
}

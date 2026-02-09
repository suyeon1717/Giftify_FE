import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import { ComingSoon } from '@/components/common/ComingSoon';

export default function FaqPage() {
    return (
        <AppShell headerTitle="자주 묻는 질문" headerVariant="detail" hasBack showBottomNav={false}>
            <ComingSoon title="자주 묻는 질문" />
            <Footer />
        </AppShell>
    );
}

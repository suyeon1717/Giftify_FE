import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import { ComingSoon } from '@/components/common/ComingSoon';

export default function NoticePage() {
    return (
        <AppShell headerTitle="공지사항" headerVariant="detail" hasBack showBottomNav={false}>
            <ComingSoon title="공지사항" />
            <Footer />
        </AppShell>
    );
}

import { AppShell } from '@/components/layout/AppShell';
import { Footer } from '@/components/layout/Footer';
import { ComingSoon } from '@/components/common/ComingSoon';

export default function LookbookPage() {
    return (
        <AppShell headerTitle="트렌드" headerVariant="detail" hasBack showBottomNav={false}>
            <ComingSoon title="트렌드" />
            <Footer />
        </AppShell>
    );
}

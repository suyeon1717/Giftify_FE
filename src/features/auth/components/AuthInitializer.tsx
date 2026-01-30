'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { sync } from '@/lib/api/auth';
import { toast } from 'sonner';

export function AuthInitializer() {
    const { user, isLoading } = useUser();
    const router = useRouter();
    const pathname = usePathname();
    const hasSynced = useRef(false);

    useEffect(() => {
        async function syncUser() {
            if (isLoading || !user || hasSynced.current) return;

            // Skip sync if we are already on the complete-signup page
            if (pathname === '/auth/complete-signup') return;

            try {
                hasSynced.current = true;
                const { isNewUser } = await sync();

                // Redirect to complete signup if it is a new user
                if (isNewUser) {
                    router.push('/auth/complete-signup');
                }
            } catch (error) {
                console.error('Failed to sync user:', error);
                // If sync fails, it might mean the backend is down or token is invalid.
                // We could force logout or show an error.
                // For now, just log it.
                // potentially: toast.error('Failed to synchronize login session.');
            }
        }

        syncUser();
    }, [user, isLoading, router, pathname]);

    return null;
}

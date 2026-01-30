'use client';

import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

/**
 * Signup Button Component
 *
 * Redirects user to Auth0 login page with signup screen hint.
 */
export function SignupButton() {
    return (
        <Button asChild variant="default" size="sm">
            <a href="/auth/login?screen_hint=signup">
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
            </a>
        </Button>
    );
}

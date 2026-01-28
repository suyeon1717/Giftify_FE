'use client';

import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

/**
 * Login Button Component
 *
 * Redirects user to Auth0 login page when clicked.
 * After successful authentication, user is redirected back to the app.
 */
export function LoginButton() {
  return (
    <Button asChild variant="default" size="sm">
      <a href="/auth/login">
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </a>
    </Button>
  );
}

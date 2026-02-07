'use client';

/**
 * AuthInitializer
 *
 * Previously handled session sync with backend, but this is now done
 * in the Auth0 onCallback (auth0.ts) during login.
 *
 * Kept as a no-op component for backwards compatibility with providers.tsx.
 * Can be removed entirely in a future cleanup.
 */
export function AuthInitializer() {
    return null;
}

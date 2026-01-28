import { auth0 } from './lib/auth/auth0';

/**
 * Proxy for Auth0 authentication (Next.js 16 convention)
 *
 * Handles authentication routes (/auth/*) and protects specific routes.
 */
export async function proxy(request: Request) {
  return await auth0.middleware(request);
}

/**
 * Matcher configuration
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

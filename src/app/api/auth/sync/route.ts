import { auth0 } from '@/lib/auth/auth0';
import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Authentication Sync Route (BFF)
 * 
 * This route is called after a successful Auth0 login to synchronize
 * the session with the backend database. It forwards the id_token
 * to the backend's login endpoint.
 */
export async function POST() {
    try {
        const session = await auth0.getSession();
        const idToken = session?.idToken;

        if (!idToken) {
            console.warn('[Sync] No ID Token found in session');
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('[Sync] Backend sync failed:', data);
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('[Sync] Unexpected Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

import { auth0 } from '@/lib/auth/auth0';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function POST(req: NextRequest) {
    try {
        const session = await auth0.getSession();

        if (!session || !session.idToken) {
            return NextResponse.json({ message: 'No active session' }, { status: 401 });
        }

        const { idToken } = session;

        // Call Backend Login API
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend Login Failed:', response.status, errorText);
            return NextResponse.json({ message: 'Backend login failed', details: errorText }, { status: response.status });
        }

        const memberData = await response.json();
        return NextResponse.json(memberData, { status: 200 });

    } catch (error) {
        console.error('Auth Sync Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

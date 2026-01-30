import { auth0 } from '@/lib/auth/auth0';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, (await params).path, 'GET');
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, (await params).path, 'POST');
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, (await params).path, 'PUT');
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, (await params).path, 'PATCH');
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, (await params).path, 'DELETE');
}

async function proxyRequest(req: NextRequest, path: string[], method: string) {
  try {
    const session = await auth0.getSession();
    const accessToken = session?.accessToken;

    if (!accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const pathString = path.join('/');
    const url = `${API_URL}/api/${pathString}${req.nextUrl.search}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };

    const body = ['GET', 'HEAD'].includes(method) ? undefined : await req.text();

    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    const data = await response.text();

    try {
      const json = JSON.parse(data);
      return NextResponse.json(json, { status: response.status });
    } catch {
      return new NextResponse(data, { status: response.status });
    }

  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

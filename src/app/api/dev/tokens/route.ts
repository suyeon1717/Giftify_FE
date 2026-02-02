import { auth0 } from '@/lib/auth/auth0';
import { NextResponse } from 'next/server';

/**
 * 개발용 토큰 확인 API
 * 
 * GET /api/dev/tokens
 * 
 * 로그인 상태에서 ID Token과 Access Token을 확인할 수 있습니다.
 * 주의: 개발 환경에서만 사용하세요!
 */
export async function GET() {
  try {
    const session = await auth0.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated. Please login first.' },
        { status: 401 }
      );
    }

    // 세션에서 토큰 정보 추출
    const tokenSet = session.tokenSet;

    return NextResponse.json({
      message: '⚠️ 개발용 토큰 정보입니다. 절대 외부에 노출하지 마세요!',
      idToken: tokenSet?.idToken || null,
      accessToken: tokenSet?.accessToken || null,
      expiresAt: tokenSet?.expiresAt || null,
      scope: tokenSet?.scope || null,
      // 사용자 정보 (ID Token 디코딩 결과)
      user: session.user,
    });
  } catch (error) {
    console.error('Failed to get tokens:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve tokens' },
      { status: 500 }
    );
  }
}

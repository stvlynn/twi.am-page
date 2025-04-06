import { NextRequest, NextResponse } from 'next/server';
import { getSafeRedirectUrl } from '@/lib/whitelist';

// Twitter OAuth2 配置
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID as string;
const TWITTER_REDIRECT_URI = process.env.TWITTER_REDIRECT_URI || 
  `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback`;

// 权限范围 - 我们只需要基本信息
const TWITTER_SCOPES = ['users.read', 'tweet.read'].join(' ');

// 生成随机状态参数以防CSRF攻击
function generateState() {
  return Math.random().toString(36).substring(2);
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const returnUrlParam = searchParams.get('returnUrl');
    
    // 验证returnUrl并使用安全的URL
    const returnUrl = getSafeRedirectUrl(returnUrlParam);
    
    // 生成状态参数并存储，用于验证回调
    const state = generateState();
    
    // 构建Twitter OAuth2授权URL
    const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', TWITTER_CLIENT_ID);
    authUrl.searchParams.append('redirect_uri', TWITTER_REDIRECT_URI);
    authUrl.searchParams.append('scope', TWITTER_SCOPES);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('code_challenge', 'challenge'); // 简化版，生产环境应该使用PKCE
    authUrl.searchParams.append('code_challenge_method', 'plain');
    
    // 将状态和返回URL存储在cookie中
    const response = NextResponse.redirect(authUrl);
    response.cookies.set('auth_state', state, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 10, // 10分钟有效期
      path: '/',
      sameSite: 'lax'
    });
    response.cookies.set('auth_return_url', returnUrl, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 10,
      path: '/',
      sameSite: 'lax'
    });
    
    return response;
  } catch (error) {
    console.error('Twitter auth error:', error);
    return NextResponse.redirect(new URL('/?authError=true', request.url));
  }
} 
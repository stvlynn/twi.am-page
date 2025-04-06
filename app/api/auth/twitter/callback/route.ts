import { NextRequest, NextResponse } from 'next/server';
import { getSafeRedirectUrl } from '@/lib/whitelist';

// Twitter OAuth2 配置
const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID as string;
const TWITTER_CLIENT_SECRET = process.env.TWITTER_CLIENT_SECRET as string;
const TWITTER_REDIRECT_URI = process.env.TWITTER_REDIRECT_URI || 
  `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback`;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    // 验证状态参数，防止CSRF攻击
    const storedState = request.cookies.get('auth_state')?.value;
    const storedReturnUrl = request.cookies.get('auth_return_url')?.value || '/';
    
    // 确保返回URL安全（再次验证，以防cookie被篡改）
    const safeReturnUrl = getSafeRedirectUrl(storedReturnUrl);
    
    if (!code || !state || state !== storedState) {
      return NextResponse.redirect(new URL(`${safeReturnUrl}?authError=invalid_state`, request.url));
    }
    
    // 交换授权码获取访问令牌
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        'code': code,
        'grant_type': 'authorization_code',
        'redirect_uri': TWITTER_REDIRECT_URI,
        'code_verifier': 'challenge', // 简化版，生产环境应该使用PKCE
      })
    });
    
    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error('Twitter token error:', error);
      return NextResponse.redirect(new URL(`${safeReturnUrl}?authError=token_error`, request.url));
    }
    
    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;
    
    // 获取用户信息
    const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    
    if (!userResponse.ok) {
      const error = await userResponse.text();
      console.error('Twitter user info error:', error);
      return NextResponse.redirect(new URL(`${safeReturnUrl}?authError=user_info_error`, request.url));
    }
    
    const userData = await userResponse.json();
    const user = {
      id: userData.data.id,
      name: userData.data.name,
      profileImage: userData.data.profile_image_url,
    };
    
    // 清除认证cookies并设置用户信息
    const response = NextResponse.redirect(new URL(safeReturnUrl, request.url));
    response.cookies.delete('auth_state');
    response.cookies.delete('auth_return_url');
    
    // 将用户信息存储在客户端cookie中
    response.cookies.set('user', JSON.stringify(user), {
      httpOnly: false, // 允许客户端JavaScript访问
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30天有效期
      path: '/',
      sameSite: 'lax'
    });
    
    return response;
  } catch (error) {
    console.error('Twitter callback error:', error);
    return NextResponse.redirect(new URL('/?authError=true', request.url));
  }
} 
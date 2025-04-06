import { NextRequest, NextResponse } from 'next/server';
import { getSafeRedirectUrl } from '@/lib/whitelist';

// Extract top-level domain for cookie setting
const ROOT_DOMAIN = process.env.ROOT_DOMAIN || 'twi.am';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const returnUrlParam = searchParams.get('returnUrl');
    
    // Validate returnUrl and use safe URL
    const returnUrl = getSafeRedirectUrl(returnUrlParam);
    
    // Create response with redirect to return URL
    const response = NextResponse.redirect(new URL(returnUrl, request.url));
    
    // Delete the user cookie by setting it to expire immediately
    // This will clear the cookie across all subdomains
    response.cookies.set('user', '', {
      expires: new Date(0), // Set expire date to past
      path: '/',
      sameSite: 'lax',
      domain: ROOT_DOMAIN,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    // Redirect to home page if there's an error
    return NextResponse.redirect(new URL('/', request.url));
  }
} 
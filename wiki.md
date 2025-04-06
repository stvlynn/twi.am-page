# Twi.am Cross-Domain Cookie Sharing Documentation

## Overview

This document outlines the cross-domain cookie sharing architecture implemented for the Twi.am platform. The system enables seamless user authentication across multiple subdomains while maintaining security best practices.

## Implementation Architecture

### Core Technologies

- **Cookie Management**: `js-cookie` library (client-side)
- **Authentication**: Twitter OAuth 2.0
- **Security**: Domain whitelist validation, sameSite policies

### Domain Structure

The system supports cookie sharing across:
- Main domain: `twi.am`
- Subdomains: `app.twi.am`, `mbti.twi.am`, `analytics.twi.am`, etc.

## Cookie Configuration

### User Authentication Cookie

```typescript
// Server-side cookie setting (in callback handler)
response.cookies.set('user', JSON.stringify(user), {
  httpOnly: false,  // Allows JavaScript access
  secure: process.env.NODE_ENV === 'production', 
  maxAge: 60 * 60 * 24 * 30,  // 30 days
  path: '/',  
  sameSite: 'lax'  // Balances security and functionality
});
```

### Session Cookies

```typescript
// OAuth state management cookies
response.cookies.set('auth_state', state, { 
  httpOnly: true,  // Not accessible via JavaScript 
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 10,  // 10 minutes
  path: '/',
  sameSite: 'lax'
});
```

## Cross-Domain Authentication Flow

1. **User initiates login** from any subdomain via `/login` page
2. **System captures return URL** and validates against domain whitelist
3. **OAuth flow completes** with Twitter/X authentication
4. **User cookie is set** with authentication information
5. **User is redirected** back to the original domain/path

## Cross-Domain Login URL Format

When redirecting users from other Twi.am projects to the authentication system, use the following URL format:

```
https://twi.am/login?returnUrl=https://your-subdomain.twi.am/your-path
```

### URL Parameters:

- `returnUrl`: The complete URL (including protocol, domain, and path) where the user should be redirected after successful authentication

### Examples:

```javascript
// Redirect from MBTI application to login page
window.location.href = 'https://twi.am/login?returnUrl=https://mbti.twi.am/profile';

// Redirect from Analytics application
window.location.href = 'https://twi.am/login?returnUrl=https://analytics.twi.am/dashboard';

// With additional query parameters (they will be preserved)
window.location.href = 'https://twi.am/login?returnUrl=' + 
  encodeURIComponent('https://app.twi.am/reports?view=monthly&id=12345');
```

### Important Notes:

- Always use `encodeURIComponent()` to properly encode the returnUrl
- The system validates all returnUrl parameters against the whitelist
- If the returnUrl is invalid or missing, users will be redirected to the homepage (`/`)

## Domain Whitelist Implementation

```typescript
// Allowed domains for redirection
export const REDIRECT_WHITELIST = [
  'https://twi.am',
  'https://app.twi.am',
  'https://mbti.twi.am',
  'https://analytics.twi.am',
  'https://stats.twi.am',
  process.env.NEXT_PUBLIC_APP_URL,
];

// Validation function
export function isUrlInWhitelist(url: string): boolean {
  if (!url) return false;
  
  try {
    const parsedUrl = new URL(url);
    return REDIRECT_WHITELIST.some(whitelistedUrl => {
      // Skip if whitelistedUrl is undefined (e.g., environment variable not set)
      if (!whitelistedUrl) return false;
      
      // Check if URL starts with a whitelisted URL
      return url.startsWith(whitelistedUrl);
    });
  } catch (error) {
    // Return false if URL format is invalid
    console.error('Invalid URL format:', error);
    return false;
  }
}
```

## Managing the Domain Whitelist

To add or modify domains in the whitelist, follow these steps:

### 1. Edit the Whitelist Configuration

Modify the `REDIRECT_WHITELIST` array in `lib/whitelist.ts`:

```typescript
// lib/whitelist.ts
export const REDIRECT_WHITELIST = [
  // Existing domains
  'https://twi.am',
  'https://app.twi.am',
  'https://mbti.twi.am',
  
  // Add your new domain
  'https://newapp.twi.am',
  
  // Always keep this entry for local development
  process.env.NEXT_PUBLIC_APP_URL,
];
```

### 2. Deployment Considerations

- The whitelist is enforced server-side during the OAuth callback process
- After updating the whitelist, deploy the authentication service to apply changes
- No client-side updates are needed except for the new application's login redirect

### 3. Testing New Domains

After adding a new domain to the whitelist:

1. Deploy the updated authentication service
2. Implement the login redirect in the new application:
   ```javascript
   // In your new application
   function redirectToLogin() {
     const currentUrl = window.location.href;
     window.location.href = `https://twi.am/login?returnUrl=${encodeURIComponent(currentUrl)}`;
   }
   ```
3. Test the complete authentication flow
4. Verify that cookies are properly shared between domains

## Client-Side Cookie Access

```typescript
// Reading user cookie on client
const userCookie = Cookies.get('user');
if (userCookie) {
  try {
    setUser(JSON.parse(userCookie));
  } catch (e) {
    console.error('Failed to parse user cookie', e);
  }
}
```

## Security Considerations

1. **CSRF Protection**: Implemented using state parameter in OAuth flow
2. **SameSite Policy**: 'lax' setting prevents CSRF while allowing cross-subdomain functionality
3. **URL Validation**: All redirect URLs are validated against whitelist
4. **Cookie Scope**: Scoped to path '/' to be available across all paths
5. **Secure Flag**: Enabled in production environments for HTTPS-only transmission

## Cross-Subdomain Implementation Notes

- User information is stored in a non-httpOnly cookie to allow JavaScript access across subdomains
- Custom redirect handling preserves authentication context between domains
- The system uses centralized authentication with distributed access

## Integration for New Subdomains

1. Add the new subdomain to the `REDIRECT_WHITELIST` array
2. Ensure the subdomain has the same implementation of `js-cookie` for cookie access
3. No changes needed to the core authentication flow

## Technical Limitations

- Relies on JavaScript being enabled in the client browser
- Requires proper CORS configuration for API requests between subdomains
- Cookie size limited to 4KB (sufficient for basic user information)

## Example: Cross-Domain Login Flow

1. User visits `mbti.twi.am` and clicks login
2. User is redirected to `/login?returnUrl=https://mbti.twi.am`
3. After Twitter authentication, user info is stored in cookie
4. User is redirected back to `mbti.twi.am` with authentication intact

 
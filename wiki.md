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
  sameSite: 'lax',  // Balances security and functionality
  domain: ROOT_DOMAIN  // Explicitly set to top-level domain for cross-subdomain sharing
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
  sameSite: 'lax',
  domain: ROOT_DOMAIN  // Explicitly set to top-level domain
});
```

## Cross-Domain Logout Feature

The platform supports cross-domain logout to ensure consistent user sessions across all subdomains. When a user logs out from any subdomain, the logout should propagate to all other subdomains.

### Logout API Implementation

The system provides a dedicated logout API endpoint that handles cookie clearing across all domains:

```typescript
// app/api/auth/logout/route.ts
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
```

### Cross-Domain Logout Flow

1. **User initiates logout** from any subdomain application
2. **Application redirects** to the central logout endpoint with a return URL
3. **Logout endpoint clears cookies** with domain set to the top-level domain
4. **User is redirected** back to the original application with cleared cookies
5. **All subdomains recognize** the user is now logged out

### Logout URL Format

To initiate a logout from any subdomain application, use one of these formats:

1. **Direct API call** (recommended for programmatic logout):
   ```
   https://twi.am/api/auth/logout?returnUrl=https://your-subdomain.twi.am/your-path
   ```

2. **Via login page** (useful for visual feedback to user):
   ```
   https://twi.am/login?returnUrl=https://your-subdomain.twi.am/your-path&logout=true
   ```

### Client Implementation Examples

#### Example 1: Direct API Call

```javascript
// In your subdomain application
function logout() {
  const currentUrl = window.location.href;
  window.location.href = `https://twi.am/api/auth/logout?returnUrl=${encodeURIComponent(currentUrl)}`;
}
```

#### Example 2: Via Login Page with Feedback

```javascript
// In your subdomain application
function logout() {
  const currentUrl = window.location.href;
  window.location.href = `https://twi.am/login?returnUrl=${encodeURIComponent(currentUrl)}&logout=true`;
}
```

## Login Page User Interface

The login page (`/login`) now provides enhanced user experience based on authentication state:

### For Logged In Users:

- Displays user's profile image
- Shows user's name
- Shows user's ID
- Provides a sign out button
- Indicates the return destination after logout (if applicable)

### For Logged Out Users:

- Provides Twitter/X authentication option
- Provides Web3 authentication option (coming soon)
- Shows terms of service information

### Handling Logout Parameter

The login page automatically processes the `logout` parameter to facilitate cross-domain logout:

```typescript
// In app/login/page.tsx
useEffect(() => {
  const checkUserAndLogout = async () => {
    // Check if logout parameter is present
    if (logout && returnUrl) {
      // Redirect to logout API with return URL
      window.location.href = `/api/auth/logout?returnUrl=${encodeURIComponent(returnUrl)}`;
      return;
    }
    
    // Otherwise check for user cookie...
  };
  
  checkUserAndLogout();
}, [logout, returnUrl]);
```

## Handling and Parsing Cookies After Redirect

When a user is redirected back to the original application (e.g., `doodle.twi.am`) after authentication, the application needs to properly handle and parse the shared cookies. Here's how to implement this in your subdomain applications:

### 1. Basic Implementation in React

```tsx
// components/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: string;
  name: string;
  profileImage: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Parse user cookie on mount and when cookie changes
  useEffect(() => {
    const loadUserFromCookie = () => {
      setIsLoading(true);
      try {
        const userCookie = Cookies.get('user');
        if (userCookie) {
          const parsedUser = JSON.parse(userCookie);
          setUser(parsedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to parse user cookie:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Load user initially
    loadUserFromCookie();

    // Set up listener for cookie changes (simplified)
    const checkCookieInterval = setInterval(loadUserFromCookie, 5000);
    return () => clearInterval(checkCookieInterval);
  }, []);

  // Redirect to login page
  const login = () => {
    const currentUrl = encodeURIComponent(window.location.href);
    window.location.href = `https://twi.am/login?returnUrl=${currentUrl}`;
  };

  // Clear user cookie
  const logout = () => {
    const currentUrl = encodeURIComponent(window.location.href);
    window.location.href = `https://twi.am/api/auth/logout?returnUrl=${currentUrl}`;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

### 2. Using the Auth Context in Your Application

```tsx
// _app.tsx or layout.tsx
import { AuthProvider } from '../components/AuthProvider';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

// In your components
import { useAuth } from '../components/AuthProvider';

function Header() {
  const { user, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <header>
      {user ? (
        <div>
          <img src={user.profileImage} alt={user.name} />
          <span>Welcome, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </header>
  );
}
```

### 3. Handling Redirect Parameters

When users are redirected back to your application, you may want to check for error parameters:

```tsx
// pages/index.tsx or app/page.tsx
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../components/AuthProvider';

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  useEffect(() => {
    // Check for auth errors from redirect
    const authError = searchParams.get('authError');
    if (authError) {
      console.error('Authentication error:', authError);
      // Show error message to user
    }
    
    // Clean up URL if needed
    if (authError) {
      const newUrl = window.location.pathname;
      router.replace(newUrl);
    }
  }, [searchParams, router]);
  
  return (
    <div>
      {user ? (
        <div>Logged in as {user.name}</div>
      ) : (
        <div>Please log in to continue</div>
      )}
    </div>
  );
}
```

### 4. Advanced: Integrating with State Management Libraries

#### With Redux

```tsx
// store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

export const loadUserFromCookie = createAsyncThunk(
  'auth/loadUserFromCookie',
  async () => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      return JSON.parse(userCookie);
    }
    throw new Error('No user cookie found');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoading: false,
    error: null
  },
  reducers: {
    logout(state) {
      // Note: This only removes the local cookie
      // For cross-domain logout, redirect to the logout API
      Cookies.remove('user', { domain: process.env.ROOT_DOMAIN || 'twi.am', path: '/' });
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserFromCookie.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUserFromCookie.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loadUserFromCookie.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.error.message;
      });
  }
});

// For local state management only
export const { logout } = authSlice.actions;

// For cross-domain logout
export const logoutAllDomains = () => () => {
  const currentUrl = encodeURIComponent(window.location.href);
  window.location.href = `https://twi.am/api/auth/logout?returnUrl=${currentUrl}`;
};

export default authSlice.reducer;
```

## Cross-Domain Cookie Sharing for Independent Vercel Projects

Since each subdomain (e.g., `doodle.twi.am`, `mbti.twi.am`) may be independently deployed on Vercel as separate projects, special configuration is required to ensure cookie sharing works correctly:

### 1. Environment Configuration

Add the `ROOT_DOMAIN` environment variable to all projects:

```
# In .env.local or Vercel environment variables
ROOT_DOMAIN=twi.am
```

### 2. Explicitly Set Cookie Domain

All cookies that need to be shared across subdomains must explicitly set the `domain` property:

```typescript
domain: process.env.ROOT_DOMAIN || 'twi.am'
```

### 3. Client-Side Configuration

In each independent application, use the same js-cookie setup:

```javascript
// In each subdomain application
import Cookies from 'js-cookie';

function getUserInfo() {
  const userCookie = Cookies.get('user');
  if (userCookie) {
    try {
      return JSON.parse(userCookie);
    } catch (e) {
      console.error('Failed to parse user cookie', e);
    }
  }
  return null;
}
```

### 4. Vercel Project Configuration

For each independent Vercel project:

1. Set the same `ROOT_DOMAIN` environment variable
2. Ensure all projects use the same cookie reading logic
3. Confirm all projects are using HTTPS (required for secure cookies)

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
6. **Domain Setting**: Explicitly set to top-level domain to enable sharing across subdomains

## Cross-Subdomain Implementation Notes

- User information is stored in a non-httpOnly cookie to allow JavaScript access across subdomains
- Custom redirect handling preserves authentication context between domains
- The system uses centralized authentication with distributed access
- Explicit domain setting ensures cookies work across independent Vercel deployments

## Integration for New Subdomains

1. Add the new subdomain to the `REDIRECT_WHITELIST` array
2. Ensure the subdomain has the same implementation of `js-cookie` for cookie access
3. Set the same `ROOT_DOMAIN` environment variable in the new project
4. No changes needed to the core authentication flow

## Technical Limitations

- Relies on JavaScript being enabled in the client browser
- Requires proper CORS configuration for API requests between subdomains
- Cookie size limited to 4KB (sufficient for basic user information)
- All subdomains must be on the same top-level domain

## Example: Cross-Domain Login Flow

1. User visits `mbti.twi.am` and clicks login
2. User is redirected to `/login?returnUrl=https://mbti.twi.am`
3. After Twitter authentication, user info is stored in cookie with `domain: 'twi.am'`
4. User is redirected back to `mbti.twi.am` with authentication intact
5. The `mbti.twi.am` application can access the shared cookie because of the domain setting

 
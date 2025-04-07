'use client';

import React, { useState, ReactNode, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Twitter, Wallet2, ArrowLeft, X, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Cookies from 'js-cookie';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// User interface
interface UserInfo {
  id: string;
  name: string;
  username?: string; // Twitter handle may be optional for backwards compatibility
  profileImage: string;
}

// Modal component
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Semi-transparent background overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />
          
          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 max-w-md w-full mx-4"
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const logout = searchParams.get('logout') === '' || searchParams.get('logout') === 'true';
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for user cookie and handle logout parameter
  useEffect(() => {
    const checkUserAndLogout = async () => {
      setLoading(true);
      
      // Check if logout parameter is present
      if (logout && returnUrl) {
        // Redirect to logout API with return URL
        window.location.href = `/api/auth/logout?returnUrl=${encodeURIComponent(returnUrl)}`;
        return;
      }
      
      // Otherwise check for user cookie
      try {
        const userCookie = Cookies.get('user');
        if (userCookie) {
          setUser(JSON.parse(userCookie));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to parse user cookie:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkUserAndLogout();
  }, [logout, returnUrl]);

  const handleTwitterLogin = () => {
    // Get possible returnUrl parameter, and pass it to Twitter auth flow
    // If no returnUrl, use main domain as default
    const redirectUrl = returnUrl 
      ? `/api/auth/twitter?returnUrl=${encodeURIComponent(returnUrl)}`
      : `/api/auth/twitter?returnUrl=${encodeURIComponent(window.location.origin)}`;
      
    window.location.href = redirectUrl;
  };

  const handleLogout = () => {
    // Build return URL - if not provided, use current origin
    const logoutReturnUrl = returnUrl || window.location.origin;
    window.location.href = `/api/auth/logout?returnUrl=${encodeURIComponent(logoutReturnUrl)}`;
  };

  const handleWeb3Login = () => {
    setComingSoonOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-twitter-blue/10 via-background to-background p-4">
      {/* Back button */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => router.push('/')}
        className="absolute top-4 left-4 flex items-center gap-1 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Home</span>
      </Button>
      
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-twitter-blue/10 mb-4 mx-auto">
          <Twitter className="h-8 w-8 text-twitter-blue" />
        </div>
        <h1 className="text-3xl font-bold text-center">Welcome to Twi.am</h1>
        <p className="text-center text-muted-foreground mt-2">
          {user ? 'You are currently signed in' : 'Sign in to your account to access all features'}
        </p>
      </motion.div>
      
      {/* Login Card or User Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
        {loading ? (
          // Loading state
          <Card className="border border-border/40 shadow-xl bg-card/95 backdrop-blur-sm">
            <CardContent className="pt-6 pb-6 flex justify-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="rounded-full bg-muted h-16 w-16 mb-4"></div>
                <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                <div className="h-3 bg-muted rounded w-32"></div>
              </div>
            </CardContent>
          </Card>
        ) : user ? (
          // User is logged in - show user info
          <Card className="border border-border/40 shadow-xl bg-card/95 backdrop-blur-sm">
            <CardHeader className="pb-2 pt-6 text-center">
              <Avatar className="h-24 w-24 mx-auto mb-2">
                {user.profileImage ? (
                  <AvatarImage src={user.profileImage} alt={user.name} />
                ) : (
                  <AvatarFallback>
                    <UserIcon className="h-12 w-12" />
                  </AvatarFallback>
                )}
              </Avatar>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              {user.username && (
                <p className="text-sm text-twitter-blue">@{user.username}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">ID: {user.id}</p>
            </CardHeader>
            <CardContent className="pb-2 space-y-4">
              <p className="text-center text-sm">You are currently logged in. You can access all features of Twi.am.</p>
            </CardContent>
            <CardFooter className="flex flex-col pt-2 pb-6">
              <Button 
                onClick={handleLogout}
                className="w-full h-12 bg-destructive hover:bg-destructive/90 text-white flex items-center justify-center gap-2"
                size="lg"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </Button>
              {returnUrl && (
                <p className="text-xs text-center text-muted-foreground mt-4">
                  You will be redirected back to your application after signing out.
                </p>
              )}
            </CardFooter>
          </Card>
        ) : (
          // User is not logged in - show login options
          <Card className="border border-border/40 shadow-xl bg-card/95 backdrop-blur-sm">
            <CardContent className="pt-6 pb-4 space-y-4">
              <div className="space-y-4">
                <Button 
                  onClick={handleTwitterLogin}
                  className="w-full h-12 bg-[#1DA1F2] hover:bg-[#1a94da] text-white flex items-center justify-center gap-2"
                  size="lg"
                >
                  <Twitter className="h-5 w-5" />
                  <span>Login with X</span>
                </Button>
                
                <div className="relative flex items-center justify-center">
                  <Separator className="absolute w-full" />
                  <span className="relative px-2 bg-card text-xs text-muted-foreground">OR</span>
                </div>
                
                <Button 
                  onClick={handleWeb3Login}
                  className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
                  size="lg"
                >
                  <Wallet2 className="h-5 w-5" />
                  <span>Login with Web3 Wallet</span>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col pt-2 pb-6">
              <p className="text-xs text-center text-muted-foreground px-6">
                By continuing, you agree to Twi.am's Terms of Service and Privacy Policy
              </p>
            </CardFooter>
          </Card>
        )}
      </motion.div>

      {/* Coming Soon Modal */}
      <Modal isOpen={comingSoonOpen} onClose={() => setComingSoonOpen(false)}>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
          <div className="relative p-6">
            <button 
              onClick={() => setComingSoonOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
            
            <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Web3 wallet login functionality is currently under development and will be available soon.
            </p>
            
            <div className="flex items-center justify-center mb-6">
              <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-3">
                <Wallet2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => setComingSoonOpen(false)}
              >
                OK, I'll wait
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
} 
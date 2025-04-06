'use client';

import React, { useState, ReactNode } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Twitter, Wallet2, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// 自定义Modal组件
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
          {/* 半透明背景遮罩 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />
          
          {/* 弹窗内容 */}
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
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  const handleTwitterLogin = () => {
    // 获取当前URL + 可能的returnUrl参数
    const redirectUrl = returnUrl 
      ? `/api/auth/twitter?returnUrl=${encodeURIComponent(returnUrl)}`
      : `/api/auth/twitter?returnUrl=${encodeURIComponent(window.location.origin)}`;
      
    window.location.href = redirectUrl;
  };

  const handleWeb3Login = () => {
    setComingSoonOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-twitter-blue/10 via-background to-background p-4">
      {/* 返回按钮 */}
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
          Sign in to your account to access all features
        </p>
      </motion.div>
      
      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-md"
      >
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
      </motion.div>

      {/* 自定义Coming Soon弹窗 */}
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
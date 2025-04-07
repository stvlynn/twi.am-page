'use client';

import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface UserInfo {
  id: string;
  name: string;
  username?: string; // Twitter handle - optional for backwards compatibility
  profileImage: string;
}

export function UserAvatar() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  
  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie));
      } catch (e) {
        console.error('Failed to parse user cookie', e);
      }
    }
  }, []);

  const handleLogin = () => {
    // 点击后跳转到登录页
    router.push('/login');
  };

  const handleLogout = () => {
    Cookies.remove('user');
    setUser(null);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none" aria-label="User menu">
          <Avatar className="h-12 w-12 cursor-pointer hover:opacity-80 transition-opacity border-2 border-twitter-blue shadow-md">
            {user?.profileImage ? (
              <AvatarImage src={user.profileImage} alt={user.name} />
            ) : (
              <AvatarFallback className="bg-twitter-blue/10 text-twitter-blue">
                <User className="h-6 w-6" />
              </AvatarFallback>
            )}
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {user ? (
          <>
            <div className="px-2 py-1.5 text-sm font-medium text-center border-b">
              {user.name}
              {user.username && (
                <div className="text-xs text-twitter-blue font-normal">@{user.username}</div>
              )}
            </div>
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={handleLogin}>
            Login
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 
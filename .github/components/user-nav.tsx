'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export function UserNav() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-foreground/60">
        Welcome, {user?.name}
      </span>
      <Button onClick={handleLogout} variant="ghost" size="sm">
        <LogOut className="h-4 w-4 mr-2" />
        Sign out
      </Button>
    </div>
  );
}
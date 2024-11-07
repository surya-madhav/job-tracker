'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Briefcase, Building2, Users, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Briefcase },
    { name: 'Applications', href: '/jobs', icon: Briefcase },
    { name: 'Companies', href: '/companies', icon: Building2 },
    { name: 'Contacts', href: '/contacts', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition-colors',
                      pathname === item.href
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:border-muted-foreground hover:text-foreground'
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="bg-background">
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
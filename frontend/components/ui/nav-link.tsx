'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
}

export function NavLink({ href, children, exact = false }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact 
    ? pathname === href
    : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "transition-colors hover:text-foreground",
        isActive 
          ? "text-foreground font-medium" 
          : "text-foreground/60"
      )}
    >
      {children}
    </Link>
  );
}
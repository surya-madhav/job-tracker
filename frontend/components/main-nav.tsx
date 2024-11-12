'use client';

import { Briefcase } from 'lucide-react';
import { NavLink } from '@/components/ui/nav-link';
import { UserNav } from './user-nav';

export function MainNav() {
  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-6 w-6" />
              <span className="text-xl font-bold">JobTrackr</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <NavLink href="/dashboard" exact>
                Dashboard
              </NavLink>
              <NavLink href="/jobs">
                Applications
              </NavLink>
              <NavLink href="/companies">
                Companies
              </NavLink>
              <NavLink href="/contacts">
                Contacts
              </NavLink>
            </div>
          </div>
          <UserNav />
        </div>
      </div>
    </nav>
  );
}
'use client';

import { ConnectKitButton } from 'connectkit';
import Link from 'next/link';
import { Search, Menu, Bell, Plus, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Left section - Menu and Logo */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>

            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Video className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">FilTube</span>
            </Link>
          </div>

          {/* Center section - Search */}
          <div className="flex-1 max-w-2xl mx-4 hidden sm:block">
            <div className="relative">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Search videos..."
                  className="flex h-9 w-full rounded-l-full border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="rounded-l-none rounded-r-full px-6 border border-l-0"
                  variant="outline"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right section - Actions and Wallet */}
          <div className="flex items-center gap-2">
            {/* Search button for mobile */}
            <Button variant="ghost" size="icon" className="sm:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Create button */}
            <Link href="/create">
              <Button variant="ghost" size="icon">
                <Plus className="h-5 w-5" />
              </Button>
            </Link>

            {/* Notifications */}
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>

            {/* Wallet Connection */}
            <div className="ml-2">
              <ConnectKitButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

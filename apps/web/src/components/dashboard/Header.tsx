'use client';

import { useState, useEffect } from 'react';
import { Menu, Search } from 'lucide-react';
import { useSocket } from '@/contexts/SocketContext';
import { cn } from '@/lib/utils';
import { NotificationsDropdown } from './Notifications';
import { SearchModal } from './SearchModal';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { isConnected, onlineUsers } = useSocket();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut for search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3 lg:px-8">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Logo for mobile - replaces menu button */}
            <div className="lg:hidden">
              <h1 className="text-lg font-bold text-gradient-premium">
                InsuriHub
              </h1>
            </div>

            {/* Search Bar */}
            <div className="hidden sm:flex items-center">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="relative w-64 lg:w-80"
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <div className="pl-10 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg text-left text-gray-400 hover:border-gold-300 transition-all">
                  Search posts, users...
                </div>
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-gray-200 rounded text-xs text-gray-500">
                  ⌘K
                </kbd>
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div className="hidden sm:flex items-center gap-2">
              <div className={cn(
                'w-2 h-2 rounded-full',
                isConnected ? 'bg-emerald-500' : 'bg-red-500'
              )} />
              <span className="text-sm text-gray-600">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
              {onlineUsers.length > 0 && (
                <span className="text-xs text-gray-500">
                  ({onlineUsers.length} online)
                </span>
              )}
            </div>

            {/* Notifications Dropdown */}
            <NotificationsDropdown />

            {/* Mobile Search */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
'use client';

import { motion } from 'framer-motion';
import { 
  Home, 
  PlusCircle, 
  MessageCircle, 
  User, 
  Settings, 
  LogOut,
  Shield,
  Coins,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ currentView, onViewChange, isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'create-post', label: 'Create Post', icon: PlusCircle },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ id: 'admin', label: 'Admin Panel', icon: Shield });
  }

  return (
    <>
      {/* Desktop Sidebar - Only visible on large screens */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:bg-white/80 lg:backdrop-blur-sm lg:border-r lg:border-gray-200">
        <SidebarContent 
          user={user}
          menuItems={menuItems}
          currentView={currentView}
          onViewChange={onViewChange}
          onLogout={logout}
        />
      </div>
    </>
  );
}

function SidebarContent({ 
  user, 
  menuItems, 
  currentView, 
  onViewChange, 
  onLogout 
}: {
  user: any;
  menuItems: any[];
  currentView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="hidden lg:flex items-center p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gradient-premium">
          InsuriHub
        </h1>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-emerald-400 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
        
        {/* Token Balance */}
        <div className="mt-3 flex items-center gap-2 p-2 bg-gradient-to-r from-gold-50 to-emerald-50 rounded-lg">
          <Coins className="w-4 h-4 text-gold-600" />
          <span className="text-sm font-medium text-gray-700">
            {user?.tokenBalance || 0} tokens
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200',
              currentView === item.id
                ? 'bg-gradient-to-r from-gold-100 to-emerald-100 text-gold-700 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button
          onClick={() => onViewChange('settings')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
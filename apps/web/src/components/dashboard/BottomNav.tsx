'use client';

import { motion } from 'framer-motion';
import { Home, PlusCircle, MessageCircle, User, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type DashboardView = 'feed' | 'create-post' | 'messages' | 'profile' | 'admin' | 'settings';

interface BottomNavProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

export function BottomNav({ currentView, onViewChange }: BottomNavProps) {
  const { user } = useAuth();

  const navItems = [
    { id: 'feed' as DashboardView, icon: Home, label: 'Home' },
    { id: 'create-post' as DashboardView, icon: PlusCircle, label: 'Post' },
    { id: 'messages' as DashboardView, icon: MessageCircle, label: 'Chat' },
    { id: 'profile' as DashboardView, icon: User, label: 'Profile' },
  ];

  // Add admin tab if user is admin
  if (user?.role === 'ADMIN') {
    navItems.push({ id: 'admin' as DashboardView, icon: Shield, label: 'Admin' });
  }

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
    >
      {/* Main nav container with glassmorphism */}
      <div className="relative bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gold-500/5 via-transparent to-transparent pointer-events-none" />

        {/* Navigation items */}
        <div className="relative flex items-center justify-around px-2 safe-area-bottom">
          <div className="flex items-center justify-around w-full max-w-md mx-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className="relative flex flex-col items-center justify-center min-w-[64px] py-2 px-3 rounded-2xl transition-all active:scale-95"
                >
                  {/* Active background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBottomTab"
                      className="absolute inset-0 bg-gradient-to-br from-gold-100 to-emerald-100 rounded-2xl shadow-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  {/* Icon container */}
                  <div className="relative z-10 mb-1">
                    <motion.div
                      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon
                        className={`w-6 h-6 transition-colors ${
                          isActive
                            ? 'text-gold-600'
                            : 'text-gray-400'
                        }`}
                      />
                    </motion.div>
                    
                    {/* Active indicator dot */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-br from-gold-500 to-emerald-500 rounded-full shadow-sm"
                      />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`relative z-10 text-xs font-medium transition-colors ${
                      isActive
                        ? 'text-gold-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

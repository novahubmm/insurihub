'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Header } from './Header';
import { Feed } from './Feed';
import { CreatePost } from './CreatePost';
import { Messages } from './Messages';
import { Profile } from './Profile';
import { AdminPanel } from './AdminPanel';
import { Settings } from './Settings';

type DashboardView = 'feed' | 'create-post' | 'messages' | 'profile' | 'admin' | 'settings';

export function Dashboard() {
  const [currentView, setCurrentView] = useState<DashboardView>('feed');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();

  const renderContent = () => {
    switch (currentView) {
      case 'feed':
        return <Feed />;
      case 'create-post':
        return <CreatePost onSuccess={() => setCurrentView('feed')} />;
      case 'messages':
        return <Messages />;
      case 'profile':
        return <Profile />;
      case 'admin':
        return user?.role === 'admin' ? <AdminPanel /> : <Feed />;
      case 'settings':
        return <Settings />;
      default:
        return <Feed />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-insurance-light via-white to-gold-50">
      <div className="flex">
        {/* Desktop Sidebar - Hidden on mobile */}
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          isOpen={false}
          onClose={() => {}}
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          {/* Header */}
          <Header onMenuClick={() => setIsSidebarOpen(true)} />

          {/* Content - Add padding bottom for mobile nav */}
          <main className="p-4 lg:p-8 pb-24 lg:pb-8">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav currentView={currentView} onViewChange={setCurrentView} />
    </div>
  );
}
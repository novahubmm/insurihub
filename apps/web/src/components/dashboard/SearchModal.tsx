'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Search, X, User, FileText, Clock, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { searchApi, SearchResults } from '@/lib/api/search';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { formatDate } from '@/lib/utils';
import { INSURANCE_CATEGORIES } from '@/types/post';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'posts' | 'users'>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch();
      } else {
        setResults({});
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, activeTab]);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const data = await searchApi.search(query, activeTab, 10);
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostClick = (postId: string) => {
    router.push(`/post/${postId}`);
    onClose();
  };

  const handleUserClick = (userId: string) => {
    router.push(`/user/${userId}`);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal with glassmorphism */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ 
            duration: 0.3,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-transparent to-emerald-500/5 pointer-events-none" />

          {/* Search Input */}
          <div className="relative p-6 border-b border-gray-200/50">
            <div className="relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="absolute left-4 top-1/2 -translate-y-1/2"
              >
                <div className="relative">
                  <Search className="w-5 h-5 text-gold-500" />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-gold-400 rounded-full blur-md"
                  />
                </div>
              </motion.div>
              
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search posts, users..."
                className="w-full pl-14 pr-14 py-4 text-lg bg-white/50 backdrop-blur-sm border-2 border-gray-200/50 rounded-2xl outline-none focus:border-gold-400 focus:bg-white/80 transition-all placeholder:text-gray-400"
                autoFocus
              />
              
              {query && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100/80 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </motion.button>
              )}
            </div>

            {/* Sparkle effect */}
            {query && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 flex items-center gap-2 text-sm text-gray-500"
              >
                <Sparkles className="w-4 h-4 text-gold-500" />
                <span>Searching across InsuriHub...</span>
              </motion.div>
            )}
          </div>

          {/* Tabs */}
          <div className="relative flex border-b border-gray-200/50 bg-white/30 backdrop-blur-sm">
            {(['all', 'posts', 'users'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative flex-1 py-4 text-sm font-medium transition-colors"
              >
                <span className={`relative z-10 ${
                  activeTab === tab
                    ? 'text-gold-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </span>
                
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-gold-100 to-emerald-100 rounded-t-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="relative max-h-96 overflow-y-auto">
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center py-12"
              >
                <LoadingSpinner size="lg" />
              </motion.div>
            ) : query.length < 2 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-12 text-center text-gray-500"
              >
                <div className="relative inline-block mb-4">
                  <Search className="w-12 h-12 text-gray-300" />
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-gold-300 rounded-full blur-xl"
                  />
                </div>
                <p>Type at least 2 characters to search</p>
              </motion.div>
            ) : (results.posts?.length === 0 && results.users?.length === 0) ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-12 text-center text-gray-500"
              >
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No results found for "{query}"</p>
              </motion.div>
            ) : (
              <div className="p-4 space-y-4">
                {/* Posts Results */}
                {results.posts && results.posts.length > 0 && (activeTab === 'all' || activeTab === 'posts') && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Posts
                    </h3>
                    <div className="space-y-2">
                      {results.posts.map((post, index) => (
                        <motion.button
                          key={post.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handlePostClick(post.id)}
                          className="w-full text-left p-4 hover:bg-gradient-to-r hover:from-gold-50 hover:to-emerald-50 rounded-xl transition-all group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-emerald-400 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                              <FileText className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 truncate group-hover:text-gold-600 transition-colors">{post.title}</h4>
                              <p className="text-sm text-gray-500 truncate">{post.content}</p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                <span>{post.author?.name}</span>
                                <span>•</span>
                                <span>{INSURANCE_CATEGORIES.find(c => c.value === post.category?.toLowerCase())?.label || post.category}</span>
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Users Results */}
                {results.users && results.users.length > 0 && (activeTab === 'all' || activeTab === 'users') && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Users
                    </h3>
                    <div className="space-y-2">
                      {results.users.map((user, index) => (
                        <motion.button
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleUserClick(user.id)}
                          className="w-full text-left p-4 hover:bg-gradient-to-r hover:from-gold-50 hover:to-emerald-50 rounded-xl transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-emerald-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                              <span className="text-white font-medium">
                                {user.name?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 group-hover:text-gold-600 transition-colors">{user.name}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="capitalize">{user.role?.toLowerCase()}</span>
                                <span>•</span>
                                <Clock className="w-3 h-3" />
                                <span>Joined {formatDate(user.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative p-4 border-t border-gray-200/50 bg-gradient-to-r from-gold-50/50 to-emerald-50/50 backdrop-blur-sm text-center"
          >
            <p className="text-xs text-gray-500">
              Press <kbd className="px-2 py-1 bg-white/80 rounded-lg text-gray-600 font-medium shadow-sm">ESC</kbd> to close
            </p>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

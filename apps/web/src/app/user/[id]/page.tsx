'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, ArrowLeft, MessageCircle, Calendar, FileText } from 'lucide-react';
import { usersApi } from '@/lib/api/users';
import { chatApi } from '@/lib/api/chat';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatDate, formatNumber } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { INSURANCE_CATEGORIES } from '@/types/post';
import toast from 'react-hot-toast';

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingChat, setIsStartingChat] = useState(false);

  const userId = params.id as string;

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const [userData, postsData] = await Promise.all([
        usersApi.getUserById(userId),
        usersApi.getUserPosts(userId),
      ]);
      setUser(userData);
      setPosts(postsData.posts || []);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      toast.error('Failed to load user profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = async () => {
    if (!currentUser) {
      toast.error('Please login to start a conversation');
      return;
    }

    setIsStartingChat(true);
    try {
      await chatApi.startConversation(userId);
      router.push('/dashboard?view=messages');
      toast.success('Conversation started!');
    } catch (error) {
      toast.error('Failed to start conversation');
    } finally {
      setIsStartingChat(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-insurance-light via-white to-gold-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-insurance-light via-white to-gold-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h1 className="text-xl font-semibold text-gray-900">User not found</h1>
          <button
            onClick={() => router.back()}
            className="mt-4 text-gold-600 hover:text-gold-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-insurance-light via-white to-gold-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6"
        >
          <div className="bg-gradient-to-r from-gold-500 to-emerald-500 h-32" />
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              <div className="w-24 h-24 bg-gradient-to-br from-gold-400 to-emerald-400 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full rounded-xl object-cover" />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.role === 'ADMIN' 
                      ? 'bg-purple-100 text-purple-700'
                      : user.role === 'AGENT'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    Joined {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
              {currentUser && currentUser.id !== userId && (
                <button
                  onClick={handleStartChat}
                  disabled={isStartingChat}
                  className="btn-primary flex items-center gap-2"
                >
                  {isStartingChat ? (
                    <LoadingSpinner size="sm" color="white" />
                  ) : (
                    <MessageCircle className="w-4 h-4" />
                  )}
                  Message
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* User Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold-100 rounded-lg">
                <FileText className="w-5 h-5 text-gold-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                <p className="text-sm text-gray-500">Posts</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 capitalize">{user.role?.toLowerCase()}</p>
                <p className="text-sm text-gray-500">Account Type</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* User Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Posts</h2>
          
          {posts.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-gray-500">No posts yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{post.title}</h3>
                      <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                    </div>
                    <span className="px-2 py-1 bg-gold-100 text-gold-700 text-xs rounded-full">
                      {INSURANCE_CATEGORIES.find(c => c.value === post.category?.toLowerCase())?.label || post.category}
                    </span>
                  </div>
                  <p className="text-gray-700 line-clamp-3">{post.content}</p>
                  {post.image && (
                    <img
                      src={post.image.startsWith('http') ? post.image : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001'}${post.image}`}
                      alt={post.title}
                      className="mt-3 rounded-lg w-full h-48 object-cover"
                    />
                  )}
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span>{formatNumber(post.likes || 0)} likes</span>
                    <span>{formatNumber(post.comments || 0)} comments</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

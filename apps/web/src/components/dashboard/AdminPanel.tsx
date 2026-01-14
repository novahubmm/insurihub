'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Coins, 
  TrendingUp, 
  Check, 
  X, 
  Eye,
  RefreshCw
} from 'lucide-react';
import { formatDate, formatNumber } from '@/lib/utils';
import { INSURANCE_CATEGORIES } from '@/types/post';
import { adminApi } from '@/lib/api/admin';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import toast from 'react-hot-toast';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'tokens' | 'users'>('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    pendingPosts: 0,
    totalTokens: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoadingStats(true);
      const data = await adminApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to load admin stats');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'posts', label: 'Posts', icon: FileText },
    { id: 'tokens', label: 'Tokens', icon: Coins },
    { id: 'users', label: 'Users', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gradient-premium mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage posts, users, and token requests
            </p>
          </div>
          <button
            onClick={fetchStats}
            className="btn-outline flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingStats ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={isLoadingStats ? '...' : formatNumber(stats.totalUsers)}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Total Posts"
          value={isLoadingStats ? '...' : formatNumber(stats.totalPosts)}
          icon={FileText}
          color="green"
        />
        <StatsCard
          title="Pending Posts"
          value={isLoadingStats ? '...' : stats.pendingPosts.toString()}
          icon={Eye}
          color="orange"
          highlight={stats.pendingPosts > 0}
        />
        <StatsCard
          title="Total Tokens"
          value={isLoadingStats ? '...' : formatNumber(stats.totalTokens)}
          icon={Coins}
          color="gold"
        />
      </div>

      {/* Tabs */}
      <div className="card p-6">
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-gold-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'posts' && <PostsTab onUpdate={fetchStats} />}
          {activeTab === 'tokens' && <TokensTab onUpdate={fetchStats} />}
          {activeTab === 'users' && <UsersTab />}
        </motion.div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color, highlight }: any) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-emerald-600',
    orange: 'from-orange-500 to-orange-600',
    gold: 'from-gold-500 to-gold-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-6 ${highlight ? 'ring-2 ring-orange-400' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 bg-gradient-to-r ${colorClasses[color]} rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

function OverviewTab() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gradient-to-r from-gold-50 to-emerald-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-2">Review Posts</h4>
          <p className="text-sm text-gray-600 mb-3">
            Approve or reject pending posts from users
          </p>
          <span className="text-xs text-gold-600 font-medium">
            Click "Posts" tab to manage
          </span>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-2">Token Requests</h4>
          <p className="text-sm text-gray-600 mb-3">
            Process token purchase requests from users
          </p>
          <span className="text-xs text-blue-600 font-medium">
            Click "Tokens" tab to manage
          </span>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-2">User Management</h4>
          <p className="text-sm text-gray-600 mb-3">
            View and manage platform users
          </p>
          <span className="text-xs text-purple-600 font-medium">
            Click "Users" tab to view
          </span>
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-xl">
        <p className="text-sm text-blue-700">
          <strong>Tip:</strong> Posts submitted by users require approval before appearing in the public feed. 
          Rejected posts will have their tokens refunded automatically.
        </p>
      </div>
    </div>
  );
}

function PostsTab({ onUpdate }: { onUpdate: () => void }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const fetchPendingPosts = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getPendingPosts();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to fetch pending posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (postId: string) => {
    try {
      setProcessingId(postId);
      await adminApi.approvePost(postId);
      toast.success('Post approved successfully!');
      setPosts(prev => prev.filter(p => p.id !== postId));
      onUpdate();
    } catch (error) {
      toast.error('Failed to approve post');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (postId: string) => {
    const reason = prompt('Enter rejection reason (optional):');
    try {
      setProcessingId(postId);
      await adminApi.rejectPost(postId, reason || undefined);
      toast.success('Post rejected. Tokens refunded to user.');
      setPosts(prev => prev.filter(p => p.id !== postId));
      onUpdate();
    } catch (error) {
      toast.error('Failed to reject post');
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Pending Posts</h3>
        <button onClick={fetchPendingPosts} className="text-sm text-gold-600 hover:text-gold-700">
          Refresh
        </button>
      </div>
      
      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No pending posts to review</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{post.title}</h4>
                <p className="text-sm text-gray-600">by {post.author?.name || 'Unknown'}</p>
              </div>
              <span className="px-2 py-1 bg-gold-100 text-gold-700 text-xs rounded-full">
                {INSURANCE_CATEGORIES.find(cat => cat.value === post.category?.toLowerCase())?.label || post.category}
              </span>
            </div>
            
            <p className="text-sm text-gray-700 mb-3 line-clamp-3">{post.content}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{formatDate(post.createdAt)}</span>
                <span>{post.tokenCost} tokens</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReject(post.id)}
                  disabled={processingId === post.id}
                  className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(post.id)}
                  disabled={processingId === post.id}
                  className="flex items-center gap-1 px-3 py-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {processingId === post.id ? (
                    <LoadingSpinner size="sm" color="green" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Approve
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function TokensTab({ onUpdate }: { onUpdate: () => void }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTokenRequests();
  }, []);

  const fetchTokenRequests = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getTokenRequests();
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Failed to fetch token requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      setProcessingId(requestId);
      await adminApi.approveTokenRequest(requestId);
      toast.success('Token request approved!');
      setRequests(prev => prev.filter(r => r.id !== requestId));
      onUpdate();
    } catch (error) {
      toast.error('Failed to approve request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    const reason = prompt('Enter rejection reason (optional):');
    try {
      setProcessingId(requestId);
      await adminApi.rejectTokenRequest(requestId, reason || undefined);
      toast.success('Token request rejected');
      setRequests(prev => prev.filter(r => r.id !== requestId));
      onUpdate();
    } catch (error) {
      toast.error('Failed to reject request');
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Token Requests</h3>
        <button onClick={fetchTokenRequests} className="text-sm text-gold-600 hover:text-gold-700">
          Refresh
        </button>
      </div>
      
      {requests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Coins className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No pending token requests</p>
        </div>
      ) : (
        requests.map((request) => (
          <div key={request.id} className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{request.user?.name || 'Unknown User'}</h4>
                <p className="text-sm text-gray-600">
                  Requesting {formatNumber(request.amount)} tokens for ${request.price}
                </p>
                <p className="text-xs text-gray-500">{formatDate(request.createdAt)}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReject(request.id)}
                  disabled={processingId === request.id}
                  className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(request.id)}
                  disabled={processingId === request.id}
                  className="flex items-center gap-1 px-3 py-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  {processingId === request.id ? (
                    <LoadingSpinner size="sm" color="green" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Approve
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await adminApi.getUsers();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
        <button onClick={fetchUsers} className="text-sm text-gold-600 hover:text-gold-700">
          Refresh
        </button>
      </div>
      
      {users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Role</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Tokens</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Posts</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-emerald-400 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">
                          {user.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-100 text-purple-700'
                        : user.role === 'AGENT'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{formatNumber(user.tokenBalance)}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{user._count?.posts || 0}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
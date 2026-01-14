'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Clock } from 'lucide-react';
import { formatDate, formatNumber } from '@/lib/utils';
import { INSURANCE_CATEGORIES } from '@/types/post';
import { postsApi } from '@/lib/api/posts';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function Feed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setPage(1);
      const data = await postsApi.getPosts(1, 10);
      let filteredPosts = data.posts || [];
      
      // Filter by category if not 'all'
      if (selectedCategory !== 'all') {
        filteredPosts = filteredPosts.filter(
          (post: any) => post.category?.toLowerCase() === selectedCategory.toLowerCase()
        );
      }
      
      setPosts(filteredPosts);
      setHasMore(data.posts?.length === 10);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPosts(getMockPosts());
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      const nextPage = page + 1;
      const data = await postsApi.getPosts(nextPage, 10);
      setPosts(prev => [...prev, ...(data.posts || [])]);
      setPage(nextPage);
      setHasMore(data.posts?.length === 10);
    } catch (error) {
      console.error('Failed to load more posts:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Feed Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <h1 className="text-2xl font-bold text-gradient-premium mb-2">
          Insurance Feed
        </h1>
        <p className="text-gray-600 mb-4">
          Stay updated with the latest insights from insurance professionals
        </p>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {INSURANCE_CATEGORIES.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.value
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-8 text-center"
          >
            <p className="text-gray-500">No posts yet. Be the first to share!</p>
          </motion.div>
        ) : (
          posts.map((post, index) => (
            <PostCard key={post.id} post={post} index={index} />
          ))
        )}
      </div>

      {/* Load More */}
      {hasMore && posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8"
        >
          <button onClick={loadMore} className="btn-outline">
            Load More Posts
          </button>
        </motion.div>
      )}
    </div>
  );
}

function PostCard({ post, index }: { post: any; index: number }) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likes, setLikes] = useState<number>(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
  const router = useRouter();

  const categoryInfo = INSURANCE_CATEGORIES.find(cat => cat.value === post.category?.toLowerCase());

  const handleLike = async () => {
    try {
      const result = await postsApi.likePost(post.id);
      setIsLiked(result.liked);
      setLikes((prev: number) => result.liked ? prev + 1 : prev - 1);
    } catch (error) {
      // Optimistic update fallback
      setIsLiked(!isLiked);
      setLikes((prev: number) => isLiked ? prev - 1 : prev + 1);
    }
  };

  const handleAuthorClick = () => {
    if (post.author?.id) {
      router.push(`/user/${post.author.id}`);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card p-6 hover:shadow-xl transition-all duration-300"
    >
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleAuthorClick}
            className="w-10 h-10 bg-gradient-to-br from-gold-400 to-emerald-400 rounded-full flex items-center justify-center hover:ring-2 hover:ring-gold-300 transition-all"
          >
            {post.author?.avatar ? (
              <img src={post.author.avatar} alt={post.author.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-white font-medium text-sm">
                {post.author?.name?.charAt(0) || 'U'}
              </span>
            )}
          </button>
          <div>
            <button
              onClick={handleAuthorClick}
              className="font-medium text-gray-900 hover:text-gold-600 transition-colors"
            >
              {post.author?.name || 'Unknown User'}
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="capitalize">{post.author?.role?.toLowerCase() || 'user'}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(post.createdAt)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Category Badge */}
          <span className="px-2 py-1 bg-gradient-to-r from-gold-100 to-emerald-100 text-gold-700 text-xs font-medium rounded-full">
            {categoryInfo?.label || post.category}
          </span>
          
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <MoreHorizontal className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {post.title}
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Post Image */}
      {post.image && (
        <div className="mb-4 rounded-xl overflow-hidden">
          <img
            src={post.image.startsWith('http') ? post.image : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001'}${post.image}`}
            alt={post.title}
            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Token Cost */}
      <div className="flex items-center gap-2 mb-4 p-2 bg-gradient-to-r from-gold-50 to-emerald-50 rounded-lg">
        <span className="text-sm text-gray-600">Cost:</span>
        <span className="text-sm font-medium text-gold-600">
          {post.tokenCost || 10} tokens
        </span>
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">{formatNumber(likes)}</span>
          </motion.button>

          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{formatNumber(post.comments || 0)}</span>
          </button>

          <button 
            onClick={() => {
              const url = `${window.location.origin}/post/${post.id}`;
              navigator.clipboard.writeText(url);
              toast.success('Link copied to clipboard!');
            }}
            className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-gray-100"
        >
          <CommentSection postId={post.id} />
        </motion.div>
      )}
    </motion.article>
  );
}

function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const data = await postsApi.getComments(postId);
      setComments(data || []);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const comment = await postsApi.addComment(postId, newComment);
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 disabled:opacity-50 transition-colors"
        >
          Post
        </button>
      </form>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center py-4">
          <LoadingSpinner size="sm" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">No comments yet</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-medium">
                  {comment.user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.user?.name || 'User'}</span>
                  <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Mock data fallback
function getMockPosts() {
  return [
    {
      id: '1',
      title: 'Understanding Auto Insurance Claims Process',
      content: 'Here\'s a comprehensive guide on how to handle auto insurance claims efficiently. The key is to document everything properly and communicate clearly with all parties involved...',
      image: null,
      category: 'AUTO',
      author: { id: '1', name: 'Sarah Johnson', avatar: null, role: 'AGENT' },
      status: 'APPROVED',
      tokenCost: 15,
      likes: 24,
      comments: 8,
      isLiked: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      title: 'Health Insurance Trends 2024',
      content: 'The health insurance landscape is evolving rapidly. Here are the top trends to watch this year, including telehealth coverage expansion and personalized premium pricing...',
      image: null,
      category: 'HEALTH',
      author: { id: '2', name: 'Michael Chen', avatar: null, role: 'CUSTOMER' },
      status: 'APPROVED',
      tokenCost: 20,
      likes: 45,
      comments: 12,
      isLiked: true,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
  ];
}
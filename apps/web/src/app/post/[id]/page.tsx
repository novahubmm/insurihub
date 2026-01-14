'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, MessageCircle, Share2, Clock, User } from 'lucide-react';
import { postsApi } from '@/lib/api/posts';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatDate, formatNumber } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { INSURANCE_CATEGORIES } from '@/types/post';
import toast from 'react-hot-toast';

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postId = params.id as string;

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      // Fetch post from the feed and find by ID
      const data = await postsApi.getPosts(1, 100);
      const foundPost = data.posts?.find((p: any) => p.id === postId);
      
      if (foundPost) {
        setPost(foundPost);
        setLikes(foundPost.likes || 0);
        setIsLiked(foundPost.isLiked || false);
        
        // Fetch comments
        const commentsData = await postsApi.getComments(postId);
        setComments(commentsData || []);
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
      toast.error('Failed to load post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const result = await postsApi.likePost(postId);
      setIsLiked(result.liked);
      setLikes(prev => result.liked ? prev + 1 : prev - 1);
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const comment = await postsApi.addComment(postId, newComment);
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-insurance-light via-white to-gold-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-insurance-light via-white to-gold-50 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h1 className="text-xl font-semibold text-gray-900">Post not found</h1>
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

  const categoryInfo = INSURANCE_CATEGORIES.find(c => c.value === post.category?.toLowerCase());

  return (
    <div className="min-h-screen bg-gradient-to-br from-insurance-light via-white to-gold-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Post */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Post Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => router.push(`/user/${post.author?.id}`)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-emerald-400 rounded-full flex items-center justify-center">
                  {post.author?.avatar ? (
                    <img src={post.author.avatar} alt={post.author.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{post.author?.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="capitalize">{post.author?.role?.toLowerCase()}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    {formatDate(post.createdAt)}
                  </div>
                </div>
              </button>
              <span className="px-3 py-1 bg-gradient-to-r from-gold-100 to-emerald-100 text-gold-700 text-sm font-medium rounded-full">
                {categoryInfo?.label || post.category}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h1>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* Post Image */}
          {post.image && (
            <div className="border-b border-gray-100">
              <img
                src={post.image.startsWith('http') ? post.image : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001'}${post.image}`}
                alt={post.title}
                className="w-full max-h-96 object-cover"
              />
            </div>
          )}

          {/* Post Actions */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                className={`flex items-center gap-2 transition-colors ${
                  isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                <span className="font-medium">{formatNumber(likes)}</span>
              </motion.button>

              <div className="flex items-center gap-2 text-gray-500">
                <MessageCircle className="w-6 h-6" />
                <span className="font-medium">{formatNumber(comments.length)}</span>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors"
              >
                <Share2 className="w-6 h-6" />
                <span className="font-medium">Share</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Comments ({comments.length})
            </h2>

            {/* Add Comment */}
            {user ? (
              <form onSubmit={handleComment} className="mb-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">
                      {user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={!newComment.trim() || isSubmitting}
                        className="btn-primary disabled:opacity-50"
                      >
                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-gray-600">
                  <button
                    onClick={() => router.push('/login')}
                    className="text-gold-600 hover:text-gold-700 font-medium"
                  >
                    Login
                  </button>
                  {' '}to leave a comment
                </p>
              </div>
            )}

            {/* Comments List */}
            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <button
                      onClick={() => router.push(`/user/${comment.user?.id}`)}
                      className="w-10 h-10 bg-gradient-to-br from-gold-400 to-emerald-400 rounded-full flex items-center justify-center flex-shrink-0 hover:ring-2 hover:ring-gold-300 transition-all"
                    >
                      <span className="text-white text-sm font-medium">
                        {comment.user?.name?.charAt(0) || 'U'}
                      </span>
                    </button>
                    <div className="flex-1 bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={() => router.push(`/user/${comment.user?.id}`)}
                          className="font-medium text-gray-900 hover:text-gold-600"
                        >
                          {comment.user?.name || 'User'}
                        </button>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.article>
      </div>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Image, X, Coins, Send, Upload } from 'lucide-react';
import { INSURANCE_CATEGORIES, InsuranceCategory } from '@/types/post';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api/client';
import { uploadApi } from '@/lib/api/upload';
import toast from 'react-hot-toast';

interface CreatePostProps {
  onSuccess: () => void;
}

export function CreatePost({ onSuccess }: CreatePostProps) {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'auto' as InsuranceCategory,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload image immediately
      setIsUploading(true);
      try {
        const result = await uploadApi.uploadImage(file);
        setUploadedImageUrl(result.url);
        toast.success('Image uploaded successfully');
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to upload image');
        setSelectedImage(null);
        setImagePreview(null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setUploadedImageUrl(null);
  };

  const calculateTokenCost = () => {
    let cost = 10; // Base cost for post
    if (selectedImage) {
      const sizeInKB = Math.ceil(selectedImage.size / 1024);
      cost += sizeInKB; // 1 token per KB
    }
    return cost;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.content.length > 500) {
      toast.error('Content must be 500 characters or less');
      return;
    }

    const tokenCost = calculateTokenCost();
    if ((user?.tokenBalance || 0) < tokenCost) {
      toast.error(`Insufficient tokens. You need ${tokenCost} tokens but have ${user?.tokenBalance || 0}`);
      return;
    }

    setIsLoading(true);

    try {
      await apiClient.post('/posts', {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        image: uploadedImageUrl,
      });
      
      toast.success('Post submitted for review!');
      await refreshUser(); // Refresh user to update token balance
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  const tokenCost = calculateTokenCost();
  const hasEnoughTokens = (user?.tokenBalance || 0) >= tokenCost;

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <h1 className="text-2xl font-bold text-gradient-premium mb-6">
          Create New Post
        </h1>

        {/* Token Balance Warning */}
        {!hasEnoughTokens && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 text-sm">
              <strong>Insufficient tokens!</strong> You need {tokenCost} tokens but only have {user?.tokenBalance || 0}. 
              Please purchase more tokens to create a post.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="input-primary"
              placeholder="Enter post title..."
              maxLength={100}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.title.length}/100 characters
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as InsuranceCategory }))}
              className="input-primary"
              required
            >
              {INSURANCE_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="input-primary min-h-[120px] resize-none"
              placeholder="Share your insurance insights..."
              maxLength={500}
              required
            />
            <p className={`text-xs mt-1 ${formData.content.length > 450 ? 'text-orange-500' : 'text-gray-500'}`}>
              {formData.content.length}/500 characters
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image (Optional - costs extra tokens)
            </label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gold-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <LoadingSpinner size="md" />
                      <span className="text-sm text-gray-600">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Image className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Click to upload an image
                      </span>
                      <span className="text-xs text-gray-500">
                        PNG, JPG up to 5MB (1 token per KB)
                      </span>
                    </>
                  )}
                </label>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <LoadingSpinner size="lg" color="white" />
                  </div>
                )}
                {uploadedImageUrl && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-emerald-500 text-white text-xs rounded-full flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    Uploaded
                  </div>
                )}
                <button
                  type="button"
                  onClick={removeImage}
                  disabled={isUploading}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Token Cost */}
          <div className={`p-4 rounded-xl ${hasEnoughTokens ? 'bg-gradient-to-r from-gold-50 to-emerald-50' : 'bg-red-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className={`w-5 h-5 ${hasEnoughTokens ? 'text-gold-600' : 'text-red-600'}`} />
                <span className="font-medium text-gray-700">Token Cost</span>
              </div>
              <div className="text-right">
                <span className={`text-lg font-bold ${hasEnoughTokens ? 'text-gold-600' : 'text-red-600'}`}>
                  {tokenCost} tokens
                </span>
                <p className="text-xs text-gray-500">
                  Balance: {user?.tokenBalance || 0} tokens
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Base cost: 10 tokens
              {selectedImage && (
                <span className="block">
                  Image: +{Math.ceil(selectedImage.size / 1024)} tokens
                </span>
              )}
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onSuccess}
              className="btn-outline flex-1"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isLoading || !hasEnoughTokens}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              {isLoading ? 'Submitting...' : 'Submit for Review'}
            </button>
          </div>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> All posts are reviewed by our admin team before being published. 
            You'll be notified once your post is approved. Tokens are deducted immediately but will be 
            refunded if your post is rejected.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
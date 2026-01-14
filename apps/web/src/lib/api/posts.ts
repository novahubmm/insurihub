import { Post, CreatePostRequest } from '@/types/post';
import { apiClient, createFormData } from './client';

export const postsApi = {
  async getPosts(page = 1, limit = 10): Promise<{ posts: Post[]; pagination: any }> {
    const response = await apiClient.get('/posts', {
      params: { page, limit },
    });
    return response.data;
  },

  async getPost(id: string): Promise<Post> {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
  },

  async createPost(data: CreatePostRequest): Promise<Post> {
    const formData = createFormData(data);
    const response = await apiClient.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async likePost(postId: string): Promise<{ liked: boolean }> {
    const response = await apiClient.post(`/posts/${postId}/like`);
    return response.data;
  },

  async getComments(postId: string): Promise<any[]> {
    const response = await apiClient.get(`/posts/${postId}/comments`);
    return response.data;
  },

  async addComment(postId: string, content: string): Promise<any> {
    const response = await apiClient.post(`/posts/${postId}/comments`, { content });
    return response.data;
  },
};
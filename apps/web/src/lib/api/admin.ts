import { apiClient } from './client';

export const adminApi = {
  // Stats
  async getStats(): Promise<{
    totalUsers: number;
    totalPosts: number;
    pendingPosts: number;
    totalTokens: number;
  }> {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },

  // Posts
  async getPendingPosts(page = 1, limit = 10): Promise<{ posts: any[]; pagination: any }> {
    const response = await apiClient.get('/admin/posts/pending', {
      params: { page, limit },
    });
    return response.data;
  },

  async approvePost(postId: string): Promise<any> {
    const response = await apiClient.post(`/admin/posts/${postId}/approve`);
    return response.data;
  },

  async rejectPost(postId: string, reason?: string): Promise<any> {
    const response = await apiClient.post(`/admin/posts/${postId}/reject`, { reason });
    return response.data;
  },

  // Token Requests
  async getTokenRequests(page = 1, limit = 10): Promise<{ requests: any[]; pagination: any }> {
    const response = await apiClient.get('/admin/tokens/requests', {
      params: { page, limit },
    });
    return response.data;
  },

  async approveTokenRequest(requestId: string): Promise<any> {
    const response = await apiClient.post(`/admin/tokens/requests/${requestId}/approve`);
    return response.data;
  },

  async rejectTokenRequest(requestId: string, reason?: string): Promise<any> {
    const response = await apiClient.post(`/admin/tokens/requests/${requestId}/reject`, { reason });
    return response.data;
  },

  // Users
  async getUsers(page = 1, limit = 20): Promise<{ users: any[]; pagination: any }> {
    const response = await apiClient.get('/admin/users', {
      params: { page, limit },
    });
    return response.data;
  },
};
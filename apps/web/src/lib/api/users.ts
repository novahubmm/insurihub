import { apiClient } from './client';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  createdAt: string;
}

export const usersApi = {
  async searchUsers(query: string, page = 1, limit = 10): Promise<{ users: User[]; pagination: any }> {
    const response = await apiClient.get('/users', {
      params: { q: query, page, limit },
    });
    return response.data;
  },

  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  async getUserPosts(id: string, page = 1, limit = 10): Promise<{ posts: any[]; pagination: any }> {
    const response = await apiClient.get(`/users/${id}/posts`, {
      params: { page, limit },
    });
    return response.data;
  },
};

import { apiClient } from './client';

export interface SearchResults {
  posts?: any[];
  users?: any[];
}

export const searchApi = {
  async search(query: string, type: 'all' | 'posts' | 'users' = 'all', limit = 10): Promise<SearchResults> {
    const response = await apiClient.get('/search', {
      params: { q: query, type, limit },
    });
    return response.data;
  },
};

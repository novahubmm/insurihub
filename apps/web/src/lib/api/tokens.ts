import { apiClient } from './client';

export const tokensApi = {
  async requestTokens(amount: number, price: number, description?: string): Promise<any> {
    const response = await apiClient.post('/tokens/request', {
      amount,
      price,
      description,
    });
    return response.data;
  },

  async getMyRequests(page = 1, limit = 10): Promise<{ requests: any[]; pagination: any }> {
    const response = await apiClient.get('/tokens/requests', {
      params: { page, limit },
    });
    return response.data;
  },

  async getTransactions(page = 1, limit = 20): Promise<{ transactions: any[]; pagination: any }> {
    const response = await apiClient.get('/tokens/transactions', {
      params: { page, limit },
    });
    return response.data;
  },

  async getBalance(): Promise<{ balance: number }> {
    const response = await apiClient.get('/tokens/balance');
    return response.data;
  },
};
import { apiClient } from './client';

export const chatApi = {
  async getConversations(): Promise<any[]> {
    const response = await apiClient.get('/chat/conversations');
    return response.data;
  },

  async getMessages(chatId: string, page = 1, limit = 50): Promise<{ messages: any[]; pagination: any }> {
    const response = await apiClient.get(`/chat/${chatId}/messages`, {
      params: { page, limit },
    });
    return response.data;
  },

  async sendMessage(data: {
    chatId?: string;
    receiverId?: string;
    content: string;
    type?: 'TEXT' | 'IMAGE' | 'FILE';
  }): Promise<any> {
    const response = await apiClient.post('/chat/messages', data);
    return response.data;
  },

  async startConversation(receiverId: string): Promise<any> {
    const response = await apiClient.post('/chat/conversations', { receiverId });
    return response.data;
  },
};
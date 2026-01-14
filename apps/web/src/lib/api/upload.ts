import { apiClient } from './client';

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  tokenCost: number;
  mimetype?: string;
}

export const uploadApi = {
  // Upload image for post
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await apiClient.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload file for chat
  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post('/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete uploaded file
  async deleteFile(filename: string): Promise<void> {
    await apiClient.delete(`/upload/${filename}`);
  },

  // Get full URL for uploaded file
  getFileUrl(path: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';
    return `${baseUrl}${path}`;
  },
};

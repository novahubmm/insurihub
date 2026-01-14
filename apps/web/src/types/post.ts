export interface Post {
  id: string;
  title: string;
  content: string;
  image?: string;
  category: InsuranceCategory;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  tokenCost: number;
  likes: number;
  comments: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Admin fields
  reviewedBy?: {
    id: string;
    name: string;
  };
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  image?: File;
  category: InsuranceCategory;
}

export interface PostComment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  postId: string;
  createdAt: string;
  updatedAt: string;
}

export type InsuranceCategory = 
  | 'auto'
  | 'health'
  | 'life'
  | 'property'
  | 'business'
  | 'travel'
  | 'disability'
  | 'liability'
  | 'marine'
  | 'cyber'
  | 'other';

export const INSURANCE_CATEGORIES: { value: InsuranceCategory; label: string }[] = [
  { value: 'auto', label: 'Auto Insurance' },
  { value: 'health', label: 'Health Insurance' },
  { value: 'life', label: 'Life Insurance' },
  { value: 'property', label: 'Property Insurance' },
  { value: 'business', label: 'Business Insurance' },
  { value: 'travel', label: 'Travel Insurance' },
  { value: 'disability', label: 'Disability Insurance' },
  { value: 'liability', label: 'Liability Insurance' },
  { value: 'marine', label: 'Marine Insurance' },
  { value: 'cyber', label: 'Cyber Insurance' },
  { value: 'other', label: 'Other' },
];
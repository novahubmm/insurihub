export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'guest' | 'customer' | 'agent' | 'admin';
  tokenBalance: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Agent specific fields (for future use)
  agentPackage?: {
    id: string;
    name: string;
    monthlyTokens: number;
    price: number;
    features: string[];
    expiresAt: string;
  };
  
  // Customer specific fields
  agentId?: string; // If customer is assigned to an agent
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}
import { apiClient } from './client';
import type { LoginResponse } from '@/types/member';

export interface LoginRequest {
  idToken: string;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>('/api/v2/auth/login', data);
}

// getMe is exported from ./members module
// sync function removed - now handled by onCallback in auth0.ts

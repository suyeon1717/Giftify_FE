import { apiClient } from './client';
import type { Member, LoginResponse } from '@/types/member';

export interface LoginRequest {
  idToken: string;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>('/api/auth/login', data);
}

export async function logout(): Promise<void> {
  return apiClient.post<void>('/api/auth/logout', {});
}

export async function getMe(): Promise<Member> {
  return apiClient.get<Member>('/api/auth/me');
}

import { apiClient } from './client';
import type { HomeData } from '@/types/home';

export async function getHomeData(): Promise<HomeData> {
  return apiClient.get<HomeData>('/api/home');
}

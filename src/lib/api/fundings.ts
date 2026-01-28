import { apiClient } from './client';
import type { PageParams } from '@/types/api';
import type {
  Funding,
  FundingDetail,
  FundingStatus,
  FundingParticipant,
  FundingCreateRequest,
  FundingListResponse,
  ParticipantListResponse,
  FundingQueryParams
} from '@/types/funding';

// Alias for backward compatibility
export type FundingsParams = FundingQueryParams;

export interface RefuseFundingRequest {
  reason?: string;
}

export async function getFunding(fundingId: string): Promise<FundingDetail> {
  return apiClient.get<FundingDetail>(`/api/fundings/${fundingId}`);
}

export async function createFunding(data: FundingCreateRequest): Promise<Funding> {
  return apiClient.post<Funding>('/api/fundings', data);
}

export async function participateFunding(fundingId: string, amount: number): Promise<FundingParticipant> {
  return apiClient.post<FundingParticipant>(`/api/fundings/${fundingId}/participate`, { amount });
}

export async function acceptFunding(fundingId: string): Promise<Funding> {
  return apiClient.post<Funding>(`/api/fundings/${fundingId}/accept`, {});
}

export async function refuseFunding(fundingId: string, data?: RefuseFundingRequest): Promise<Funding> {
  return apiClient.post<Funding>(`/api/fundings/${fundingId}/refuse`, data || {});
}

export async function getMyOrganizedFundings(params?: FundingsParams): Promise<FundingListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/api/fundings/my/organized?${queryString}` : '/api/fundings/my/organized';

  return apiClient.get<FundingListResponse>(endpoint);
}

export async function getMyParticipatedFundings(params?: FundingsParams): Promise<FundingListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/api/fundings/my/participated?${queryString}` : '/api/fundings/my/participated';

  return apiClient.get<FundingListResponse>(endpoint);
}

export async function getMyReceivedFundings(params?: FundingsParams): Promise<FundingListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/api/fundings/my/received?${queryString}` : '/api/fundings/my/received';

  return apiClient.get<FundingListResponse>(endpoint);
}

export async function getFundings(params?: FundingsParams): Promise<FundingListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/api/fundings?${queryString}` : '/api/fundings';

  return apiClient.get<FundingListResponse>(endpoint);
}

export async function getFundingParticipants(fundingId: string, params?: PageParams): Promise<ParticipantListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/api/fundings/${fundingId}/participants?${queryString}` : `/api/fundings/${fundingId}/participants`;

  return apiClient.get<ParticipantListResponse>(endpoint);
}

import { apiClient } from './client';
import type { PageParams } from '@/types/api';
import type {
  Member,
  MemberPublic,
  MemberUpdateRequest,
  MemberListResponse,
  RegistrationStatusResponse,
  NicknameCheckResponse
} from '@/types/member';

export async function getMember(memberId: string): Promise<MemberPublic> {
  return apiClient.get<MemberPublic>(`/api/v2/members/${memberId}`);
}

export async function getMe(): Promise<Member> {
  return apiClient.get<Member>('/api/v2/members/me');
}

export async function updateMe(data: MemberUpdateRequest): Promise<Member> {
  return apiClient.patch<Member>('/api/v2/members/me', data);
}

/**
 * @deprecated Use updateMe instead for updating own profile
 */
export async function updateMember(memberId: string, data: MemberUpdateRequest): Promise<Member> {
  return apiClient.patch<Member>(`/api/v2/members/${memberId}`, data);
}

export async function deleteMe(): Promise<void> {
  return apiClient.delete<void>('/api/v2/members/me');
}

export async function signupMember(data: MemberUpdateRequest): Promise<Member> {
  return apiClient.post<Member>('/api/v2/members/signup', data);
}

export async function checkRegistration(): Promise<RegistrationStatusResponse> {
  return apiClient.get<RegistrationStatusResponse>('/api/v2/members/check-registration');
}

export async function checkNickname(nickname: string): Promise<NicknameCheckResponse> {
  const params = new URLSearchParams({ nickname });
  return apiClient.get<NicknameCheckResponse>(`/api/v2/members/check/nickname?${params.toString()}`);
}

export async function getMemberFriends(memberId: string, params?: PageParams): Promise<MemberListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/api/v2/members/${memberId}/friends?${queryString}` : `/api/v2/members/${memberId}/friends`;

  return apiClient.get<MemberListResponse>(endpoint);
}

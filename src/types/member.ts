import { PaginatedResponse } from './api';

/**
 * Member role enumeration
 */
export type MemberRole = 'USER' | 'SELLER';

/**
 * Member status enumeration
 */
export type MemberStatus = 'ACTIVE' | 'SUSPENDED' | 'WITHDRAWN';

/**
 * Full member information (private)
 */
export interface Member {
    id: string;
    authSub: string;
    nickname: string | null; // Make nickname nullable as per new requirements
    email: string;
    avatarUrl: string | null;
    role: MemberRole;
    status: MemberStatus;
    birthday?: string; // ISO date string (YYYY-MM-DD)
    address?: string;
    phoneNum?: string;
    createdAt: string;
}

/**
 * Public member information visible to other users
 */
export interface MemberPublic {
    id: string;
    nickname: string | null;
    avatarUrl: string | null;
}

export interface MemberUpdateRequest {
    nickname?: string;
    avatarUrl?: string;
    birthday?: string;
    address?: string;
    phoneNum?: string;
}

/**
 * Paginated list of public member information
 */
export type MemberListResponse = PaginatedResponse<MemberPublic>;

/**
 * Login response with member data and new user flag
 */
export interface LoginResponse {
    member: Member;
    isNewUser: boolean;
}

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
    nickname: string;
    email: string;
    avatarUrl: string | null;
    role: MemberRole;
    status: MemberStatus;
    createdAt: string;
}

/**
 * Public member information visible to other users
 */
export interface MemberPublic {
    id: string;
    nickname: string;
    avatarUrl: string | null;
}

/**
 * Request body for updating member information
 */
export interface MemberUpdateRequest {
    nickname?: string;
    avatarUrl?: string;
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

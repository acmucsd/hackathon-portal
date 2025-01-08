import type { UserPatches, PatchUserRequest, LoginRequest } from '@/lib/types/apiRequests';
import type {
  PrivateProfile,
  GetCurrentUserResponse,
  PatchUserResponse,
  LoginResponse,
} from '@/lib/types/apiResponses';
import axios from 'axios';

export const login = async (email: string, password: string): Promise<string> => {
  const requestBody: LoginRequest = { email, password };
  const response = await axios.post<LoginResponse>('/api/login', requestBody);
  return response.data.token;
};

/**
 * Get current user's private profile
 * @returns User's profile
 */
export const getCurrentUser = async (token: string): Promise<PrivateProfile> => {
  const response = await axios.get<GetCurrentUserResponse>(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/getCurrentUser`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.user;
};

/**
 * Update current user's private profile
 * @param user Profile changes
 * @returns User's full profile
 */
export const updateCurrentUserProfile = async (user: UserPatches): Promise<PrivateProfile> => {
  const requestBody: PatchUserRequest = { user };
  const response = await axios.patch<PatchUserResponse>('/api/updateUser', requestBody);
  return response.data.user;
};

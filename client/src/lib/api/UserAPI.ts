import config from '@/lib/config';
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
 * @param token Authorization bearer token
 * @returns User's profile
 */
export const getCurrentUser = async (): Promise<PrivateProfile> => {
  const response = await axios.get<GetCurrentUserResponse>('/api/getCurrentUser');
  return response.data.user;
};

/**
 * Update current user's private profile
 * @param token Authorization bearer token
 * @param user Profile changes
 * @returns User's full profile
 */
export const updateCurrentUserProfile = async (
  token: string,
  user: UserPatches
): Promise<PrivateProfile> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.user.user}`;

  const requestBody: PatchUserRequest = { user };

  const response = await axios.patch<PatchUserResponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.user;
};

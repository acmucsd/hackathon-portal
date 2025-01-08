import config from '@/lib/config';
import type { UserPatches, PatchUserRequest } from '@/lib/types/apiRequests';
import type {
  PrivateProfile,
  GetCurrentUserResponse,
  PatchUserResponse,
} from '@/lib/types/apiResponses';
import axios from 'axios';

/**
 * Get current user's private profile
 * @param token Authorization bearer token
 * @returns User's profile
 */
export const getCurrentUser = async (token: string): Promise<PrivateProfile> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.user.user}`;
  const response = await axios.get<GetCurrentUserResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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

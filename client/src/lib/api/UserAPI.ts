import config from '@/lib/config';
import type { UserPatches, PatchUserRequest } from '@/lib/types/apiRequests';
import type {
  PrivateProfile,
  GetCurrentUserResponse,
  PatchUserResponse,
} from '@/lib/types/apiResponses';
import { CookieService } from '@/lib/services';
import { CookieType } from '@/lib/types/enums';
import { OptionsType } from 'cookies-next/lib/types';
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

export const getCurrentUserAndRefreshCookie = async (
  token: string,
  options: OptionsType
): Promise<PrivateProfile> => {
  const userCookie = CookieService.getServerCookie(CookieType.USER, options);
  if (userCookie) return JSON.parse(userCookie);

  const user: PrivateProfile = await getCurrentUser(token);

  const { req, res } = options;
  CookieService.setServerCookie(CookieType.USER, JSON.stringify(user), {
    req,
    res,
    maxAge: 5 * 60,
  });

  return user;
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

'use server';

import type { UserPatches, PatchUserRequest, LoginRequest } from '@/lib/types/apiRequests';
import type {
  PrivateProfile,
  GetCurrentUserResponse,
  LoginResponse,
  UpdateCurrentUserReponse,
  PublicProfile,
  GetUserResponse,
} from '@/lib/types/apiResponses';
import axios from 'axios';
import config from '@/lib/config';
import { getCookie, setCookie } from '../services/CookieService';
import { CookieType } from '../types/enums';
import { getErrorMessage } from '../utils';

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.auth.login}`;
  const requestBody: LoginRequest = { email, password };
  const response = await axios.post<LoginResponse>(requestUrl, requestBody);
  return response.data;
};

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
 * Get a user's public profile
 * @param userId User ID
 * @returns User's profile
 */
export const getUser = async (userId: string): Promise<PublicProfile | string> => {
  const authToken = await getCookie(CookieType.ACCESS_TOKEN);

  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.user.user}/${userId}`;

  try {
    const response = await axios.get<GetUserResponse>(requestUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data.user;
  } catch (error) {
    return getErrorMessage(error);
  }
};

/**
 * Update current user's private profile
 * @param user Profile changes
 * @returns User's full profile
 */
export const updateCurrentUserProfile = async (
  user: UserPatches
): Promise<PrivateProfile | string> => {
  const authToken = await getCookie(CookieType.ACCESS_TOKEN);

  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.user.user}`;

  const requestBody: PatchUserRequest = { user };

  try {
    const response = await axios.patch<UpdateCurrentUserReponse>(requestUrl, requestBody, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    await setCookie(CookieType.USER, JSON.stringify(response.data.user));

    return response.data.user;
  } catch (error) {
    return getErrorMessage(error);
  }
};

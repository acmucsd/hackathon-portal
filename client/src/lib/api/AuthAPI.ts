import config from '@/lib/config';
import type { UserRegistration } from '@/lib/types/apiRequests';
import type { PrivateProfile, RegistrationResponse } from '@/lib/types/apiResponses';
import axios from 'axios';

/**
 * Make a register request to create a new user
 * @param data UserRegistration info (email, name, major, etc.)
 * @returns PrivateProfile containing user information on successful creation
 */
export const register = async (user: UserRegistration): Promise<PrivateProfile> => {
  const requestUrl = `${config.api.baseApiUrl}${config.api.endpoints.auth.register}`;

  const response = await axios.post<RegistrationResponse>(requestUrl, { user: user });

  return response.data.user;
};

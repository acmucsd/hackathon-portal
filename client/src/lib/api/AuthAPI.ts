import config from '@/lib/config';
import type { ForgotPasswordRequest, UserRegistration } from '@/lib/types/apiRequests';
import type {
  PrivateProfile,
  CreateUserResponse,
  ForgotPasswordResponse,
} from '@/lib/types/apiResponses';
import axios from 'axios';

/**
 * Make a register request to create a new user
 * @param data UserRegistration info (email, name, major, etc.)
 * @returns PrivateProfile containing user information on successful creation
 */
export const register = async (user: UserRegistration): Promise<PrivateProfile> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.auth.register}`;

  const response = await axios.post<CreateUserResponse>(requestUrl, { user: user });

  return response.data.user;
};

export const forgotPassword = async (
  forgotReq: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.auth.forgotPassword}`;

  const response = await axios.post<ForgotPasswordResponse>(requestUrl, { email: forgotReq.email });

  return response.data;
};

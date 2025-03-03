import { AuthAPI } from '@/lib/api';
import { APIHandlerProps } from '@/lib/types';
import type { ForgotPasswordRequest, UserRegistration } from '@/lib/types/apiRequests';
import { ForgotPasswordResponse, PrivateProfile } from '@/lib/types/apiResponses';

/**
 * Registers a new user account and provides callback
 * @param data
 */
export const register = async (
  data: UserRegistration & APIHandlerProps<PrivateProfile>
): Promise<void> => {
  const { onSuccessCallback, onFailCallback, ...userRegistration } = data;
  try {
    const user = await AuthAPI.register(userRegistration);
    onSuccessCallback?.(user);
  } catch (e) {
    onFailCallback?.(e);
  }
};

/**
 * Registers a new user account and provides callback
 * @param data
 */
export const resetPassword = async (
  data: ForgotPasswordRequest & APIHandlerProps<ForgotPasswordResponse>
): Promise<void> => {
  const { onSuccessCallback, onFailCallback, ...userResetReq } = data;
  try {
    const response = await AuthAPI.forgotPassword(userResetReq);
    onSuccessCallback?.(response);
  } catch (e) {
    onFailCallback?.(e);
  }
};

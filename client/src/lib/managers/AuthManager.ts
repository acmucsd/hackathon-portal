import { AuthAPI } from '@/lib/api';
import { APIHandlerProps } from '@/lib/types';
import type { UserRegistration } from '@/lib/types/apiRequests';
import { PrivateProfile } from '@/lib/types/apiResponses';

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

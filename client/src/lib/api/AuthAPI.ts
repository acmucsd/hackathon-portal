import config from '@/lib/config';
import type {
  ForgotPasswordRequest,
  UserRegistration,
} from '@/lib/types/apiRequests';
import type {
  PrivateProfile,
  CreateUserResponse,
  ForgotPasswordResponse,
  ApiResponse,
  VerifyTokenResponse,
} from '@/lib/types/apiResponses';
import { auth } from '@/lib/firebase';
import axios from 'axios';
import {
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

/**
 * Make a register request to create a new user
 * @param data UserRegistration info (email, name, major, etc.)
 * @returns PrivateProfile containing user information on successful creation
 */
export const register = async (
  user: UserRegistration
): Promise<PrivateProfile> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.auth.register}`;

  // is ther a way to do this in a transaction so both must succeed
  const response = await axios.post<CreateUserResponse>(requestUrl, { user: user });
  const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);

  await sendEmailVerification(userCredential.user);
  await signOut(auth);

  return response.data.user;
};

export const verifyToken = async (
  token: string
): Promise<PrivateProfile> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.auth.verifyToken}`;
  const response = await axios.post<VerifyTokenResponse>(requestUrl, { token });
  return response.data.user;
};

export const login = async (
  email: string,
  password: string
): Promise<PrivateProfile> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();

    const sessionResponse = await fetch('/api/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
      credentials: 'include',
    });

    if (!sessionResponse.ok) {
      const body = (await sessionResponse.json().catch(() => null)) as
        | (ApiResponse & { error?: { message?: string } })
        | null;
      throw new Error(body?.error?.message ?? 'Failed to create authenticated session.');
    }

    const body = (await sessionResponse.json()) as VerifyTokenResponse;
    return body.user;
  } finally {
    // Keep auth material out of browser storage; session cookies are server-managed.
    await signOut(auth).catch(() => undefined);
  }
};

export const forgotPassword = async (
  forgotReq: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  await sendPasswordResetEmail(auth, forgotReq.email);
  return { error: null };
};

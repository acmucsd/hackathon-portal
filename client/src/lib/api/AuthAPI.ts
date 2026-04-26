import config from '@/lib/config';
import type { ForgotPasswordRequest, UserRegistration } from '@/lib/types/apiRequests';
import type {
  PrivateProfile,
  CreateUserResponse,
  ForgotPasswordResponse,
  VerifyTokenResponse,
} from '@/lib/types/apiResponses';
import { auth } from '@/lib/firebase';
import axios from 'axios';
import {
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { setSession } from '@/lib/actions/session';

export const register = async (user: UserRegistration): Promise<PrivateProfile> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.auth.register}`;

  const response = await axios.post<CreateUserResponse>(requestUrl, { user: user });
  const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);

  await sendEmailVerification(userCredential.user);
  await signOut(auth);

  return response.data.user;
};

export const verifyToken = async (token: string): Promise<PrivateProfile> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.auth.verifyToken}`;
  const response = await axios.post<VerifyTokenResponse>(requestUrl, { token });
  return response.data.user;
};

export const login = async (email: string, password: string): Promise<PrivateProfile> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();

    const result = await setSession(token);

    if (result.error) {
      throw new Error(result.error);
    }

    if (!result.user) {
      throw new Error('Failed to create authenticated session.');
    }

    return result.user;
  } finally {
    await signOut(auth).catch(() => undefined);
  }
};

export const loginWithGoogle = async (): Promise<PrivateProfile> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const token = await userCredential.user.getIdToken();

    const result = await setSession(token);

    if (result.error) {
      throw new Error(result.error);
    }

    if (!result.user) {
      throw new Error('Failed to create authenticated session.');
    }

    return result.user;
  } finally {
    await signOut(auth).catch(() => undefined);
  }
};

export const forgotPassword = async (
  forgotReq: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
  await sendPasswordResetEmail(auth, forgotReq.email);
  return { error: null };
};

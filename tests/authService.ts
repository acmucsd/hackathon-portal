import { auth } from '../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  UserCredential,
} from 'firebase/auth';

export const register = async (
  email: string,
  password: string,
): Promise<UserCredential | void> => {
  try {
    console.log('authService.ts');
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log('User registered:', userCredential.user);
    return userCredential;
  } catch (error) {
    console.error('Error registering user:', error);
  }
};

export const login = async (
  email: string,
  password: string,
): Promise<UserCredential | void> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log('User logged in:', userCredential.user);
    return userCredential;
  } catch (error) {
    console.error('Error logging in:', error);
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent to:', email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
  }
};

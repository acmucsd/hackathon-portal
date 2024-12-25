import { auth } from './FirebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  UserCredential,
} from 'firebase/auth';
import { verifyToken } from '@/api/Users';

export const register = async (
  email: string,
  password: string,
): Promise<UserCredential | void> => {
  try {
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

    // Get JWT token and send to backend
    const token = await userCredential.user?.getIdToken();
    if (!token) {
      console.error("Could not retrieve JWT token.");
    } else {
      console.log('Got token:', token);
      await sendTokenToServer(token);
    }

    return userCredential;
  } catch (error) {
    console.error('Error logging in:', error);
  }
};



// send JWT firebase token to backend to be authenticated
const sendTokenToServer = async (token: string) => {
  console.log("sendTokenToServer");
  const res = await verifyToken(token);
  if (!res.success) {
    if (res.error === "Failed to fetch") {
    } else {
      console.error(`Cannot retrieve: error ${res.error}`);
    }
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

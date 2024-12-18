import { FirebaseOptions, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { Config } from './config';

const firebaseConfig: FirebaseOptions = {
  apiKey: Config.firebase.apiKey,
  authDomain: Config.firebase.authDomain,
  projectId: Config.firebase.projectId,
  storageBucket: Config.firebase.storageBucket,
  messagingSenderId: Config.firebase.messagingSenderId,
  appId: Config.firebase.appId,
  measurementId: Config.firebase.measurementId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

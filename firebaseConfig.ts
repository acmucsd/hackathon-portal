import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAbIs31G1I9Tp_wvAYLZRlAfGb7GPa1cuY',
  authDomain: 'hackathon-portal-2beea.firebaseapp.com',
  projectId: 'hackathon-portal-2beea',
  storageBucket: 'hackathon-portal-2beea.firebasestorage.app',
  messagingSenderId: '772400561761',
  appId: '1:772400561761:web:81fc3009d7b452258a3420',
  measurementId: 'G-3QSZ7Q0CPH',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
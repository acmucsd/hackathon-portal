import axios from 'axios';
import { logout } from '../actions/logout';

const client = axios.create({});

client.interceptors.response.use(
  response => response,

  async error => {
    // invalid token so logout
    if (error.response?.status === 401) {
      await logout();
      console.log('bad user', error.message);
    }
    return Promise.reject(error);
  }
);

export default client;

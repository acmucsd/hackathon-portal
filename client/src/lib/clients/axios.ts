import axios from 'axios';
import showToast from '../showToast';
import { getErrorMessage } from '../utils';
import { logoutAction } from '../actions/logout';
import { logout } from '../api/AuthAPI';

const client = axios.create({});

client.interceptors.response.use(
  response => response,

  async error => {
    if (getErrorMessage(error) === 'Missing auth token') {
      if (typeof window === 'undefined') { // server call
        logoutAction();
      } else { // client call
        showToast('Error', 'Expired session.');
        logout();
      }
      return Promise.reject('Expired session.');;
    } else {
      return Promise.reject(error);
    }
  }
);

export default client;

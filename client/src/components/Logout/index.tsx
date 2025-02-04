import { useEffect } from 'react';
import { deleteUserCookies } from '@/lib/services/CookieService';

const Logout = () => {
  // useEffect for server actions
  useEffect(() => {
    deleteUserCookies();
  });
  return <></>;
};

export default Dashboard;

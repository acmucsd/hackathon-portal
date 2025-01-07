import { getCookie, setCookie, type OptionsType } from 'cookies-next';

export const getClientCookie = (key: string): string => {
  return getCookie(key) as string;
};

export const getServerCookie = (key: string, options: OptionsType): string => {
  return getCookie(key, options) as string;
};

export const setClientCookie = (key: string, value: string, options?: OptionsType): void => {
  setCookie(key, value, options);
};

export const setServerCookie = (key: string, value: string, options: OptionsType): void => {
  setCookie(key, value, options);
};

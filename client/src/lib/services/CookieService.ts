import { getCookie, setCookie } from 'cookies-next';
import type { OptionsType } from 'cookies-next/lib/types';

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

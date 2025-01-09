import config from '@/lib/config';
import { serializeCookie } from '@/lib/services/CookieService';
import { LoginRequest } from '@/lib/types/apiRequests';
import { LoginResponse } from '@/lib/types/apiResponses';
import { CookieType } from '@/lib/types/enums';
import { getErrorMessage } from '@/lib/utils';
import axios, { AxiosError } from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const login = async (email: string, password: string): Promise<LoginResponse> => {
  const requestUrl = `${config.api.baseApiUrl}${config.api.endpoints.auth.login}`;
  const requestBody: LoginRequest = { email, password };
  const response = await axios.post<LoginResponse>(requestUrl, requestBody);
  return response.data;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    const loginResponse = await login(email, password);

    const url = new URL('/', request.url);
    const response = NextResponse.redirect(url);

    response.cookies.set(CookieType.ACCESS_TOKEN, loginResponse.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    response.cookies.set(CookieType.USER, JSON.stringify(loginResponse.user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    response.headers.set('x-middleware-cache', 'no-cache');

    return response;
  } catch (error) {
    console.error(error);
    if (error instanceof AxiosError) {
      return NextResponse.json({ error: getErrorMessage(error) }, { status: error.status || 500 });
    }
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

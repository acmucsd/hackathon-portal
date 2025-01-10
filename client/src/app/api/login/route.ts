import config from '@/lib/config';
import { setCookie } from '@/lib/services/CookieService';
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
    setCookie(CookieType.ACCESS_TOKEN, loginResponse.token);
    setCookie(CookieType.USER, JSON.stringify(loginResponse.user));
    return NextResponse.json(loginResponse);
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json({ error: getErrorMessage(error) }, { status: error.status || 500 });
    }
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

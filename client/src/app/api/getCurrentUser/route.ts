import config from '@/lib/config';
import { NextResponse } from 'next/server';
import { GetCurrentUserResponse } from '@/lib/types/apiResponses';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import axios, { AxiosError } from 'axios';

/**
 * Get current user's private profile
 * @param token Authorization bearer token
 * @returns User's profile
 */
export const getCurrentUser = async (token: string): Promise<GetCurrentUserResponse> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.user.user}`;
  const response = await axios.get<GetCurrentUserResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export async function GET() {
  try {
    const accessToken = await getCookie(CookieType.ACCESS_TOKEN);
    const response = await getCurrentUser(accessToken);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof AxiosError) {
      return NextResponse.json(
        { error: error.response?.data.message },
        { status: error.status || 500 }
      );
    }
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
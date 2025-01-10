import config from '@/lib/config';
import { NextRequest, NextResponse } from 'next/server';
import { GetCurrentUserResponse } from '@/lib/types/apiResponses';
import axios, { AxiosError } from 'axios';

/**
 * Get current user's private profile
 * @param token Authorization bearer token
 * @returns User's profile
 */
const getCurrentUser = async (token: string): Promise<GetCurrentUserResponse> => {
  const requestUrl = `${config.api.baseApiUrl}${config.api.endpoints.user.user}`;
  const response = await axios.get<GetCurrentUserResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Authorization token missing' }, { status: 401 });
    }

    const response = await getCurrentUser(token);
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

import config from '@/lib/config';
import type { UserPatches, PatchUserRequest } from '@/lib/types/apiRequests';
import type { UpdateCurrentUserReponse } from '@/lib/types/apiResponses';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import { NextResponse, NextRequest } from 'next/server';
import axios, { AxiosError } from 'axios';

const updateCurrentUserProfile = async (
  token: string,
  user: UserPatches
): Promise<UpdateCurrentUserReponse> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.user.user}`;

  const requestBody: PatchUserRequest = { user };

  const response = await axios.patch<UpdateCurrentUserReponse>(requestUrl, requestBody, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export async function PATCH(request: NextRequest) {
  try {
    const authToken = await getCookie(CookieType.ACCESS_TOKEN);
    const body = await request.json();
    const user: UserPatches = body.user;

    const updatedUser = await updateCurrentUserProfile(authToken, user);

    return NextResponse.json(updatedUser);
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

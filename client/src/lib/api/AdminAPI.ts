import config from '@/lib/config';
import type { GetApplicationsResponse, GetApplicationResponse, ResponseModel } from '@/lib/types/apiResponses';
import axios from 'axios';

/**
 * Get all applications
 * @returns All users application
 */
export const getApplications = async (token: string): Promise<ResponseModel[]> => {
  const response = await axios.get<GetApplicationsResponse>(
    `${config.api.baseUrl}${config.api.endpoints.admin.applications}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.responses;
};

/**
 * Get one user's application
 * @param token
 * @param uuid
 * @returns All users application
 */
export const getApplication = async (token: string, uuid: string): Promise<ResponseModel> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.admin.application}/${uuid}`;
  const response = await axios.get<GetApplicationResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.response;
};
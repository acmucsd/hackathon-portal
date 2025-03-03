import config from '@/lib/config';
import type {
  GetApplicationsResponse,
  GetApplicationResponse,
  GetUsersResponse,
  GetUserApplicationResponse,
  GetApplicationDecisionResponse,
  UpdateApplicationDecisionResponse,
  ResponseModel,
  PrivateProfile,
  HiddenProfile,
} from '@/lib/types/apiResponses';
import { ApplicationDecision } from '@/lib/types/enums';
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
 * Get one user's application based on application id
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

/**
 * Get all users
 * @param token
 * @returns All users application
 */
export const getUsers = async (token: string): Promise<PrivateProfile[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.admin.users}`;
  const response = await axios.get<GetUsersResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.users;
};

/**
 * Get user's application based on user id
 * @param token
 * @param id
 * @returns All users application
 */
export const getUserWithApplication = async (token: string, id: string): Promise<ResponseModel> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.admin.userApplication}/${id}`;
  const response = await axios.get<GetUserApplicationResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.application;
};

/**
 * Get user's application decision based on user id
 * @param token
 * @param id
 * @returns User's profile with decision
 */
export const getApplicationDecision = async (token: string, id: string): Promise<HiddenProfile> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.admin.application}/${id}/decision`;
  const response = await axios.get<GetApplicationDecisionResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.user;
};

/**
 * Update user's application decision based on user id
 * @param token
 * @param id
 * @returns User's profile with decision
 */
export const updateApplicationDecision = async (
  token: string,
  id: string,
  applicationDecision: ApplicationDecision
): Promise<HiddenProfile> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.admin.application}/${id}/decision`;
  const response = await axios.post<UpdateApplicationDecisionResponse>(
    requestUrl,
    { applicationDecision },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.user;
};

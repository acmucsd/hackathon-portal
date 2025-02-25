'use server';

import config from '@/lib/config';
import type {} from '@/lib/types/apiRequests';
import type {
  GetFormsResponse,
  ResponseModel,
  SubmitApplicationResponse,
} from '@/lib/types/apiResponses';
import axios from 'axios';
import { Application } from '../types/application';
import { getErrorMessage } from '../utils';

/**
 * Get current user's responses
 * @returns User's responses
 */
export const getResponsesForCurrentUser = async (token: string): Promise<ResponseModel[]> => {
  const response = await axios.get<GetFormsResponse>(
    `${config.api.baseUrl}${config.api.endpoints.response.response}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.responses;
};

/**
 * Get current user's application
 * @returns User's application
 */
export const getApplication = async (token: string): Promise<ResponseModel> => {
  const response = await axios.get<SubmitApplicationResponse>(
    `${config.api.baseUrl}${config.api.endpoints.response.application}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.response;
};

/**
 * Create an application for the current user
 * @param application Application
 * @returns Created application
 */
export const submitApplication = async (
  token: string,
  formData: FormData
): Promise<ResponseModel | { error: string }> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.response.application}`;

  try {
    const response = await axios.post<SubmitApplicationResponse>(requestUrl, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.response;
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

/**
 * Update current user's application
 * @param application Application changes
 * @returns Updated application
 */
export const updateApplication = async (
  token: string,
  application: Application,
  file?: File
): Promise<ResponseModel> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.response.application}`;

  const formData = new FormData();
  formData.append('application', JSON.stringify(application));
  if (file) {
    formData.append('file', file);
  }

  const response = await axios.patch<SubmitApplicationResponse>(requestUrl, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.response;
};

/**
 * Delete current user's application
 */
export const deleteApplication = async (token: string): Promise<void> => {
  await axios.delete(`${config.api.baseUrl}${config.api.endpoints.response.application}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

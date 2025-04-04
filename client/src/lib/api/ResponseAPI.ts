'use server';

import config from '@/lib/config';
import type {} from '@/lib/types/apiRequests';
import type {
  GetFormsResponse,
  ResponseModel,
  SubmitApplicationResponse,
} from '@/lib/types/apiResponses';
import axios from 'axios';
import { Application, Waiver } from '../types/application';
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
 * @param formData Application
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
 * @param formData Application changes
 * @returns Updated application
 */
export const updateApplication = async (
  token: string,
  formData: FormData
): Promise<ResponseModel | { error: string }> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.response.application}`;

  try {
    const response = await axios.patch<SubmitApplicationResponse>(requestUrl, formData, {
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
 * Delete current user's application
 */
export const deleteApplication = async (token: string): Promise<void> => {
  await axios.delete(`${config.api.baseUrl}${config.api.endpoints.response.application}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

/**
 * Submit liability waiver for the current user
 * @param waiver Waiver
 * @returns Created waiver
 */
export const submitLiabilityWaiver = async (
  token: string,
  waiver: Waiver
): Promise<ResponseModel | { error: string }> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.response.liabilityWaiver}`;

  try {
    const response = await axios.post<SubmitApplicationResponse>(requestUrl, waiver, {
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
 * Submit photo release form for the current user
 * @param waiver Waiver
 * @returns Created waiver
 */
export const submitPhotoRelease = async (
  token: string,
  waiver: Waiver
): Promise<ResponseModel | { error: string }> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.response.photoRelease}`;

  try {
    const response = await axios.post<SubmitApplicationResponse>(requestUrl, waiver, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.response;
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

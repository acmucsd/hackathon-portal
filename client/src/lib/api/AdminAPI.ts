import config from '@/lib/config';
import type {
  GetApplicationsResponse,
  GetApplicationResponse,
  GetUsersResponse,
  GetUserApplicationResponse,
  GetApplicationDecisionResponse,
  UpdateApplicationDecisionResponse,
  ResponseModel,
  FullProfile,
  GetFormsResponse,
  ConfirmUserStatusResponse,
  AttendEventResponse,
  PublicEvent,
  GetEmailVerificationLinkResponse,
  PostAssignmentsResponse,
  GetAssignmentsResponse,
  ReviewAssignment,
} from '@/lib/types/apiResponses';
import { ApplicationDecision } from '@/lib/types/enums';
import axios from 'axios';
import { PostAssignmentsRequest } from '../types/apiRequests';

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
export const getUsers = async (token: string): Promise<FullProfile[]> => {
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
 * @returns User's application
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
export const getApplicationDecision = async (token: string, id: string): Promise<FullProfile> => {
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
  applicationDecision: ApplicationDecision,
  reviewerComments?: string,
): Promise<FullProfile> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.admin.application}/${id}/decision`;
  const response = await axios.post<UpdateApplicationDecisionResponse>(
    requestUrl,
    { applicationDecision, reviewerComments },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.user;
};

/**
 * Updates user status to CONFIRMED in the portal.
 * @param token
 * @param id
 * @returns User's updated profile.
 */
export const confirmUserStatus = async (token: string, id: string): Promise<FullProfile> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.admin.confirmUser}/${id}`;
  const response = await axios.post<ConfirmUserStatusResponse>(requestUrl, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.user;
};

/**
 * Get user's waivers based on user id
 * @param token
 * @param id
 * @returns User's waivers
 */
export const getWaiversById = async (token: string, id: string): Promise<ResponseModel[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.admin.waivers}/${id}`;
  const response = await axios.get<GetFormsResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.responses;
};

/**
 * Get user's waivers based on user id
 * @param token
 * @param id
 * @returns User's waivers
 */
export const attendEvent = async (
  token: string,
  userId: string,
  eventId: string
): Promise<PublicEvent> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.admin.attendance}/${eventId}/${userId}`;
  const response = await axios.post<AttendEventResponse>(
    requestUrl,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.event;
};

/**
 * Get email verification link for a user
 * @param token
 * @param email User's email address
 * @returns Email verification link
 */
export const getEmailVerificationLink = async (token: string, email: string): Promise<string> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.admin.emailVerificationLink}?email=${encodeURIComponent(email)}`;
  const response = await axios.get<GetEmailVerificationLinkResponse>(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.emailVerificationLink;
};


/**
 * Assign applications to reviewers randomly
 * @param token
 */
export const postAssigments = async (token: string, newAssignments: PostAssignmentsRequest): Promise<ReviewAssignment[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.admin.assignments}`;
  const response = await axios.post<PostAssignmentsResponse>(
    requestUrl,
    { newAssignments },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.newAssignments;
};

/**
 * Randomly assign all unassigned applications to reviewers
 * @param token
 */
export const randomizeAssigments = async (token: string): Promise<ReviewAssignment[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.admin.randomizeAssignments}`;
  const response = await axios.post<PostAssignmentsResponse>(
    requestUrl,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.newAssignments;
};

/**
 * Get all existing assignments
 * @param token
 */
export const getAllAssignments = async (token: string): Promise<ReviewAssignment[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.admin.assignments}`;
  const response = await axios.get<GetAssignmentsResponse>(
    requestUrl,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.assignments;
};

/**
 * Get all existing assignments for reviewer
 * @param token
 * @param reviewerId
 */
export const getAssignmentsByReviewer = async (token: string, reviewerId: string): Promise<ReviewAssignment[]> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.admin.assignments}/${reviewerId}`;
  const response = await axios.get<GetAssignmentsResponse>(
    requestUrl,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.assignments;
};

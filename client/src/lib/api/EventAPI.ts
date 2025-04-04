import config from '@/lib/config';
import { PublicEvent, CreateEventResponse } from '../types/apiResponses';
import { CreateEventRequest } from '../types/apiRequests';
import axios from 'axios';

/**
 * Make a request to create an event
 * @param token Access token for admin
 * @param event Event info
 * @returns PublicEvent containing event information on successful creation
 */
export const createEvent = async (
  token: string,
  event: CreateEventRequest
): Promise<PublicEvent> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.event.createEvent}`;

  const response = await axios.post<CreateEventResponse>(
    requestUrl,
    { event: event },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.event;
};

import config from '@/lib/config';
import {
  PublicEvent,
  CreateEventResponse,
  GetAllEventsResponse,
  UpdateEventResponse,
  GetOneEventResponse,
} from '../types/apiResponses';
import { getErrorMessage } from '../utils';
import axios from 'axios';

/**
 * Make a request to create an event
 * @param token Access token for admin
 * @param event Event info
 * @returns PublicEvent containing event information on successful creation
 */
export const createEvent = async (token: string, event: PublicEvent): Promise<PublicEvent> => {
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

/**
 * Get all events
 * @param token Access token for admin
 * @returns All events
 */
export const getEvents = async (token: string): Promise<PublicEvent[]> => {
  const response = await axios.get<GetAllEventsResponse>(
    `${config.api.baseUrl}${config.api.endpoints.event.getAllEvents}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.events;
};

/**
 * Get all published events
 * @param token Access token for user
 * @returns All published events
 */
export const getPublishedEvents = async (token: string): Promise<PublicEvent[]> => {
  const response = await axios.get<GetAllEventsResponse>(
    `${config.api.baseUrl}${config.api.endpoints.event.getAllEvents}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.events;
};

/**
 * Get event based on id
 * @param token Access token for admin
 * @param uuid Event id
 * @returns All events
 */
export const getEvent = async (token: string, uuid: string): Promise<PublicEvent> => {
  const response = await axios.get<GetOneEventResponse>(
    `${config.api.baseUrl}${config.api.endpoints.event.getEvent}/${uuid}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.event;
};

/**
 * Update event's information
 * @param token Access token for admin
 * @param updatedEvent Event changes
 * @param uuid Event id
 * @returns Updated event
 */
export const updateEvent = async (
  token: string,
  updatedEvent: PublicEvent,
  uuid: string
): Promise<PublicEvent | { error: string }> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.event.updateEvent}/${uuid}`;

  try {
    const response = await axios.patch<UpdateEventResponse>(
      requestUrl,
      { event: updatedEvent },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.event;
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

/**
 * Delete event
 * @param token Access token for admin
 * @param uuid Event id
 */
export const deleteEvent = async (token: string, uuid: string): Promise<void> => {
  const requestUrl = `${config.api.baseUrl}${config.api.endpoints.event.deleteEvent}/${uuid}`;
  await axios.delete(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

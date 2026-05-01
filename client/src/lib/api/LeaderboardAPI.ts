import axios from 'axios';
import { HouseLeaderboardResponse } from '../types/apiResponses';
import { House } from '../types/enums';
import config from '../config';
import { getErrorMessage } from '@/lib/utils';

/**
 * Get House leaderboard
 * @returns List of houses sorted in decreasing order of points
 */
export const getHouseLeaderboard = async (token: string): Promise<House[]> => {
  try {
    const response = await axios.get<HouseLeaderboardResponse>(
      `${config.api.baseUrl}${config.api.endpoints.leaderboard.leaderboard}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.leaderboard;
  } catch (error) {
    reportError(error);
    return [];
    //return getErrorMessage(error);
  }
};

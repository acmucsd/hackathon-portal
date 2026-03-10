import axios from "axios";
import { HouseLeaderboardResponse, HouseLeaderboardWithPointsResponse, HousePoints } from "../types/apiResponses";
import { House } from "../types/enums";
import config from "../config";

/**
 * Get House leaderboard
 * @returns List of houses sorted in decreasing order of points
 */
export const getHouseLeaderboard = async (token: string): Promise<House[]> => {
  const response = await axios.get<HouseLeaderboardResponse>(
    `${config.api.baseUrl}${config.api.endpoints.leaderboard.house}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.leaderboard;
};

/**
 * Get House leaderboard with points
 * @returns List of houses sorted in decreasing order of points
 */
export const getHouseLeaderboardWithPoints = async (token: string): Promise<HousePoints[]> => {
  // admin only, route might not be necessary unless
  // admins wanna see it on a dashboard or reveal it at
  // the ending ceremony using this route
  const response = await axios.get<HouseLeaderboardWithPointsResponse>(
    `${config.api.baseUrl}${config.api.endpoints.leaderboard.housePoints}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.leaderboard;
};

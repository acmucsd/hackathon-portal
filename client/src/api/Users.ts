import { Config } from "../../config";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface APIResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const API_BASE_URL = Config.backendURL;

export const createAuthHeader = (firebaseToken: string) => ({
  Authorization: `Bearer ${firebaseToken}`,
});

// Verify Token Function
export const verifyToken = async (firebaseToken: string): Promise<APIResult<User>> => {
  console.log("verifyToken");
  try {
    const response = await get("/api/v1/auth/verifyToken", createAuthHeader(firebaseToken));

    if (!response.ok) {
      throw new Error(`Failed to verify token: ${response.statusText}`);
    }

    const json = (await response.json()) as User;
    console.log("json: ", json);
    return { success: true, data: json };
  } catch (error) {
    console.error("Error in verifyToken:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Generic GET Request Function
export const get = async (url: string, headers: Record<string, string>) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers, // Add custom headers like Authorization
    },
  });

  return response;
};

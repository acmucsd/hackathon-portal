export interface UserRegistration {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserPatches {
  firstName?: string;
  lastName?: string;
}

export interface PatchUserRequest {
  user: UserPatches;
}

export interface LoginRequest {
  email: string;
  password: string;
}

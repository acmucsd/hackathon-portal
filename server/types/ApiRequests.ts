export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CreateUserRequest {
  user: CreateUser;
}

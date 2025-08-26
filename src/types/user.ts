
type UserRole = 'USER' | 'ADMIN';
export interface Users {
  id: number;
  userName: string;
  role: UserRole;
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface CreateUser {
  userName: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  users: Users;
}

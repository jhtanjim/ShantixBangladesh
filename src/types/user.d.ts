import { User } from './auth';

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}

export interface UsersResponse {
  users: User[];
  totalCount: number;
  page: number;
  limit: number;
}

export interface UserContextType {
  getUser: (id: string) => Promise<User>;
  getUsers: () => Promise<UsersResponse>;
  updateUser: (id: string, data: UpdateUserDto) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  getUserProfile: () => Promise<User>;
}
export interface AuthPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

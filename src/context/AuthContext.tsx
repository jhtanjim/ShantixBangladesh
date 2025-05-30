import { createContext, useContext, useState, ReactNode } from "react";
import { loginUser } from "../api/auth";
import { getCurrentUser } from "../api/users";

export type LoginType = { email: string; password: string };
export type AuthResponse = {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "USER" | "ADMIN";
  };
};

type AuthContextType = {
  token: string | null;
  login: (data: LoginType) => Promise<AuthResponse>;
  logout: () => void;
user: () => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

 const login = async (data: LoginType): Promise<AuthResponse> => {
  const result = await loginUser(data); // ✅ Correct
  localStorage.setItem("token", result.accessToken);
  setToken(result.accessToken);
  return result;
};
// current user

const user = async () => {
  return await getCurrentUser();
};

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout,user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/users";
import { useAuth } from "../Context/AuthContext";

export const useCurrentUser = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    enabled: !!token,
    retry: false,
  });
};

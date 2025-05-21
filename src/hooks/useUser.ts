import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { UpdateUserDto, UsersResponse } from '../types/user';
import { User } from '../types/auth';
import { useAuth } from './useAuth';

export const useUser = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  // Get current user profile
  const useGetUserProfile = () => {
    return useQuery({
      queryKey: ['userProfile'],
      queryFn: async (): Promise<User> => {
        const response = await axiosInstance.get('/users/profile');
        return response.data;
      },
      enabled: isAuthenticated
    });
  };

  // Get user by ID
  const useGetUser = (id: string, enabled = true) => {
    return useQuery({
      queryKey: ['user', id],
      queryFn: async (): Promise<User> => {
        const response = await axiosInstance.get(`/users/${id}`);
        return response.data;
      },
      enabled: enabled && isAuthenticated
    });
  };

  // Get all users
  const useGetUsers = (page = 1, limit = 10) => {
    return useQuery({
      queryKey: ['users', page, limit],
      queryFn: async (): Promise<UsersResponse> => {
        const response = await axiosInstance.get('/users', {
          params: { page, limit }
        });
        return response.data;
      },
      enabled: isAuthenticated
    });
  };

  // Update user
  const useUpdateUser = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: UpdateUserDto }): Promise<User> => {
        const response = await axiosInstance.put(`/users/${id}`, data);
        return response.data;
      },
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
        queryClient.invalidateQueries({ queryKey: ['users'] });
        if (variables.id === 'profile') {
          queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        }
      }
    });
  };

  // Delete user
  const useDeleteUser = () => {
    return useMutation({
      mutationFn: async (id: string): Promise<void> => {
        await axiosInstance.delete(`/users/${id}`);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
      }
    });
  };

  return {
    useGetUserProfile,
    useGetUser,
    useGetUsers,
    useUpdateUser,
    useDeleteUser
  };
};

export default useUser;
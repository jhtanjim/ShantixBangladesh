// src/hooks/useTeam.jsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../api/axios"; // Your Axios instance

// API FUNCTIONS
const createTeamMember = (data) => axios.post("/team", data);
const getActiveTeamMembers = () => axios.get("/team");
const getAllTeamMembers = () => axios.get("/team/all");
const getTeamMemberById = (id) => axios.get(`/team/${id}`);
const updateTeamMember = (id, data) => axios.patch(`/team/${id}`, data);
const deleteTeamMember = (id) => axios.delete(`/team/${id}`);
const softDeleteTeamMember = (id) => axios.patch(`/team/${id}/soft-delete`);
const uploadTeamImage = (id, formData) => axios.post(`/team/${id}/upload-image`, formData);
const removeTeamImage = (id) => axios.delete(`/team/${id}/image`);
const reorderTeamMembers = (data) => axios.patch("/team/reorder", data);

// HOOKS
export const useGetActiveTeam = () => {
  return useQuery({
    queryKey: ["team", "active"],
    queryFn: getActiveTeamMembers,
  });
};

export const useGetAllTeam = () => {
  return useQuery({
    queryKey: ["team", "all"],
    queryFn: getAllTeamMembers,
  });
};

export const useGetTeamById = (id) => {
  return useQuery({
    queryKey: ["team", id],
    queryFn: () => getTeamMemberById(id),
    enabled: !!id,
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });
};

// ✅ FIXED: Accept ID in the mutation call
export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => updateTeamMember(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ["team", variables.id] });
      }
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });
};

export const useSoftDeleteTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: softDeleteTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });
};

export const useUploadTeamImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }) => uploadTeamImage(id, formData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ["team", variables.id] });
      }
    },
  });
};

// ✅ FIXED: Accept ID in the mutation call
export const useRemoveTeamImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }) => removeTeamImage(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ["team", variables.id] });
      }
    },
  });
};

export const useReorderTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorderTeamMembers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });
};
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  activateSchedule,
  createSchedule,
  deactivateSchedule,
  deleteSchedule,
  getAdminSchedules,
  getSchedules,
  updateSchedule,
} from "../api/shipSchedule";

const useShipSchedule = () => {
  const queryClient = useQueryClient();

  // Get all ship schedules
  const {
    data: schedules,
    isLoading,
    isError,
    refetch: refetchSchedules,
  } = useQuery({
    queryKey: ["schedules"],
    queryFn: getSchedules,
  });

  // Get admin ship schedules
  const {
    data: adminSchedules,
    isLoading: isAdminLoading,
    isError: isAdminError,
    refetch: refetchAdminSchedules,
  } = useQuery({
    queryKey: ["adminSchedules"],
    queryFn: getAdminSchedules,
  });

  // Helper function to invalidate both queries
  const invalidateScheduleQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["schedules"] });
    queryClient.invalidateQueries({ queryKey: ["adminSchedules"] });
  };

  // Create schedule mutation
  const createMutation = useMutation({
    mutationFn: (data) => createSchedule(data),
    onSuccess: () => {
      invalidateScheduleQueries(); // ✅ Invalidate both queries
    },
  });

  // Update schedule mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateSchedule(id, data),
    onSuccess: () => {
      invalidateScheduleQueries(); // ✅ Invalidate both queries
    },
  });

  // Delete schedule mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteSchedule(id),
    onSuccess: () => {
      invalidateScheduleQueries(); // ✅ Invalidate both queries
    },
  });

  // Activate schedule mutation
  const activateMutation = useMutation({
    mutationFn: (id) => activateSchedule(id),
    onSuccess: () => {
      invalidateScheduleQueries(); // ✅ Invalidate both queries
    },
  });

  // Deactivate schedule mutation
  const deactivateMutation = useMutation({
    mutationFn: (id) => deactivateSchedule(id),
    onSuccess: () => {
      invalidateScheduleQueries(); // ✅ Invalidate both queries
    },
  });

  return {
    schedules,
    adminSchedules,
    isLoading,
    isError,
    isAdminLoading,
    isAdminError,
    createMutation,
    updateMutation,
    deleteMutation,
    activateMutation,
    deactivateMutation,
    refetchSchedules,
    refetchAdminSchedules,
    // Optional: return the combined loading state
    isAnyLoading: isLoading || isAdminLoading,
    // Optional: return the combined error state
    hasAnyError: isError || isAdminError,
  };
};

export default useShipSchedule;
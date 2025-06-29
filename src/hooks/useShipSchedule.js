import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  
  createSchedule,
  updateSchedule,
  deleteSchedule,
  activateSchedule,
  deactivateSchedule,
  getAdminSchedules,
} from "../api/shipSchedule"; // Adjust path as needed
import { getSchedules } from "../api/shipSchedule";

const useShipSchedule = () => {
  const queryClient = useQueryClient();

  // Get all ship schedules
  const {
    data: schedules,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["schedules"],
    queryFn: getSchedules,
  });

  // Create schedule mutation
  const createMutation = useMutation({
    mutationFn: (data) => createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });

  // Update schedule mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });

  // Delete schedule mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });

  // Activate schedule mutation
  const activateMutation = useMutation({
    mutationFn: (id) => activateSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });

  // Deactivate schedule mutation
  const deactivateMutation = useMutation({
    mutationFn: (id) => deactivateSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });

  // Get admin ship schedules
  const { data: adminSchedules } = useQuery({
    queryKey: ["adminSchedules"],
    queryFn: getAdminSchedules,
  });

  return {
    schedules,
    isLoading,
    isError,
    createMutation,
    updateMutation,
    deleteMutation,
    activateMutation,
    deactivateMutation,
    adminSchedules,
  };
};

export default useShipSchedule;

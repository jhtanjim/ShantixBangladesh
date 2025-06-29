import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { createContact } from "../api/contact";


// Create new inquiry (public)
export const useCreateContactInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact"] });
    },
  });
};

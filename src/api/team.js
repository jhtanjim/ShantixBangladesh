import axios from "./axios";

const teamAPI = {
  // Get all active team members
  getActiveTeamMembers: async () => {
    try {
      const response = await axios.get("/team");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch active team members");
    }
  },

  // Get all team members (including inactive)
  getAllTeamMembers: async () => {
    try {
      const response = await axios.get("/team/all");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch all team members");
    }
  },

  // Get team member by ID
  getTeamMemberById: async (id) => {
    try {
      const response = await axios.get(`/team/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch team member");
    }
  },

  // Create new team member
  createTeamMember: async (memberData) => {
    try {
      const response = await axios.post("/team", memberData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create team member");
    }
  },

  // Update team member
  updateTeamMember: async (id, memberData) => {
    try {
      const response = await axios.put(`/team/${id}`, memberData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update team member");
    }
  },

  // Delete team member (hard delete)
  deleteTeamMember: async (id) => {
    try {
      const response = await axios.delete(`/team/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete team member");
    }
  },

  // Soft delete team member
  softDeleteTeamMember: async (id) => {
    try {
      const response = await axios.post(`/team/${id}/soft-delete`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to soft delete team member");
    }
  },

  // Upload image for team member
  uploadTeamMemberImage: async (id, imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      
      const response = await axios.post(`/team/${id}/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to upload image");
    }
  },

  // Remove image from team member
  removeTeamMemberImage: async (id) => {
    try {
      const response = await axios.delete(`/team/${id}/image`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to remove image");
    }
  },

  // Reorder team members
  reorderTeamMembers: async (orderData) => {
    try {
      const response = await axios.post("/team/reorder", orderData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to reorder team members");
    }
  },
};

export default teamAPI;
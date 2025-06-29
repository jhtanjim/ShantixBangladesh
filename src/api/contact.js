import axios from "./axios";

// Submit a new inquiry (public)
export const createContact = async (data) => {
  const response = await axios.post("/inquiries/contact-us", data);
  return response.data;
};

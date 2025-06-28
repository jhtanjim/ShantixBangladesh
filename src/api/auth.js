import axios from "./axios";

export const loginUser = async (data) => {
  const response = await axios.post("/auth/login", data)
  return response.data
}

export const registerUser = async (data) => {
  const response = await axios.post("/auth/register", data)
  return response.data
}
export const forgotPass = async (email) => {
  const res = await axios.post("/auth/request-password-reset", { email });
  return res.data;
};
export const resetPass = async (data) => {
   const res = await axios.post("/auth/reset-password", data);
  return res.data;
};
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
  console.log(email)
  const res = await api.post("/auth/request-password-reset", { email });
  return res.data;
};
export const resetPass = async (data) => {
  const res = await api.post("/auth/reset-password", data);
  // console.log(res);
  return res.data;
};
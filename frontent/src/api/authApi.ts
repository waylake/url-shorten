import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password,
  });
  return response.data;
};

export const registerUser = async (
  username: string,
  email: string,
  password: string,
) => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, {
    username,
    email,
    password,
  });
  return response.data;
};

export const getUserInfo = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/auth/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

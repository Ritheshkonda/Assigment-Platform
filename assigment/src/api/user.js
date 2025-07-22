import axios from './axios';

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post('/users/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Invalid credentials");
  }
};

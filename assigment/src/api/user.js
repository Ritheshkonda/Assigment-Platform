// src/api/user.js
import axios from './axios';

export const loginUser = async (email, password, role) => {
  try {
    const response = await axios.post('/users/login', {
      email,
      password,
      role, // pass role
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.msg || "Login error";
  }
};

import api from './axios';


export const loginUser = async (credentials) => {
  const response = await api.post('/authentication/token', credentials);
  return response.data;
};

export const registerUser = async (credentials) => {
  const response = await api.post('/authentication/users/', credentials);
  return response.data;
};
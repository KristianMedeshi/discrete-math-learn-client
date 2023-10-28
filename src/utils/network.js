import axios from 'axios';

const axiosAPI = axios.create({
  baseURL: 'http://ec2-13-49-65-35.eu-north-1.compute.amazonaws.com/api',
});

axiosAPI.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'application/json';
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signUp = async (data) => {
  try {
    const response = await axiosAPI.post('/users/sign-up', data);
    return response;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

export const signIn = async (data) => {
  try {
    const response = await axiosAPI.post('/users/sign-in', data);
    return response;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

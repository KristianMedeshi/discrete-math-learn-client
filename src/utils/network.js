import axios from 'axios';

const axiosAPI = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

axiosAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signUp = async (data) => {
  try {
    const response = await axiosAPI.post('/sign-up', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

export const signIn = async (data) => {
  try {
    const response = await axiosAPI.post('/sign-in', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const uploadSingle = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axiosAPI.post('/upload', { file }, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response?.data;
};

export default axiosAPI;

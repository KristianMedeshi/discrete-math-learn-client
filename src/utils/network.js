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

export const getQuestions = async () => {
  try {
    const response = await axiosAPI.get('/forum');
    return response?.data;
  } catch (error) {
    console.error('Get questions error:', error);
    throw error;
  }
};

export const createQuestion = async (data) => {
  try {
    const response = await axiosAPI.post('/forum', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Post question error:', error);
    throw error;
  }
};

export const getQuestion = async (questionId) => {
  try {
    const response = await axiosAPI.get(`/forum/${questionId}`);
    return response?.data;
  } catch (error) {
    console.error('Get question error:', error);
    throw error;
  }
};

export const createAnswer = async (id, data) => {
  try {
    const response = await axiosAPI.post(`/forum/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Post answer error:', error);
    throw error;
  }
};

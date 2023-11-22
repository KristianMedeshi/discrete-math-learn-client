import axiosAPI from './network';

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

export const getMyInfo = async () => {
  try {
    const response = await axiosAPI.get('/users/me');
    return response?.data;
  } catch (error) {
    console.error('Get my info error:', error);
    throw error;
  }
};

export const updateMyInfo = async (data) => {
  try {
    const response = await axiosAPI.patch('/users/me', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Get my info error:', error);
    throw error;
  }
};

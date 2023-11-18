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

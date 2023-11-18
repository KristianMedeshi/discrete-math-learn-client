import axiosAPI from './network';

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
    console.error('Upload error:', error);
    throw error;
  }
};

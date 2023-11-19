import axiosAPI from './network';

export const getCourses = async (skip, limit, difficulties, durationRange) => {
  try {
    const response = await axiosAPI.get('/courses', {
      params: {
        skip,
        limit,
        difficulties,
        durationRange,
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Get courses error:', error);
    throw error;
  }
};

export const createCourse = async (data) => {
  try {
    const response = await axiosAPI.post('/courses', data);
    return response?.data;
  } catch (error) {
    console.error('Get courses error:', error);
    throw error;
  }
};

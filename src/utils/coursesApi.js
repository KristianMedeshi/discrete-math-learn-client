import axiosAPI from './network';

export const getCourses = async (skip, limit, levels, durationRange) => {
  try {
    const response = await axiosAPI.get('/courses', {
      params: {
        skip,
        limit,
        levels,
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
    const response = await axiosAPI.post('/courses', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response?.data;
  } catch (error) {
    console.error('Get courses error:', error);
    throw error;
  }
};

export const getCourse = async (id) => {
  try {
    const response = await axiosAPI.get(`/courses/${id}`);
    return response?.data;
  } catch (error) {
    console.error('Get course error:', error);
    throw error;
  }
};

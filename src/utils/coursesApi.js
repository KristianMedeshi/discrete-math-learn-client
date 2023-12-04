import axiosAPI from './network';

export const getCourses = async (skip, limit, name, levels, durationRange) => {
  try {
    const response = await axiosAPI.get('/courses', {
      params: {
        skip,
        limit,
        name,
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

export const getCourseBlock = async (courseId, blockId) => {
  try {
    const response = await axiosAPI.get(`/courses/${courseId}/${blockId}`);
    return response?.data;
  } catch (error) {
    console.error('Get course block error:', error);
    throw error;
  }
};

export const createCourseChapter = async (id, data) => {
  try {
    const response = await axiosAPI.post(`/courses/${id}`, data);
    return response?.data;
  } catch (error) {
    console.error('Post course chapter error:', error);
    throw error;
  }
};

export const buyCourse = async (id) => {
  try {
    const response = await axiosAPI.post(`/courses/buy/${id}`);
    return response?.data;
  } catch (error) {
    console.error('Buy course error:', error);
    throw error;
  }
};

export const markAsCompleted = async (id, data) => {
  try {
    const response = await axiosAPI.post(`/courses/mark/${id}`, data);
    return response?.data;
  } catch (error) {
    console.error('Mark course block error:', error);
    throw error;
  }
};

export const getMyCourses = async (params) => {
  try {
    const response = await axiosAPI.get('/courses/my', { params });
    return response?.data;
  } catch (error) {
    console.error('Get my courses error:', error);
    throw error;
  }
};

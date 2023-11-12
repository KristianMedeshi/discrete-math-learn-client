import { createSlice } from '@reduxjs/toolkit';

const initialState = { isAuthorized: false };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuthorized(state, action) {
      const isAuthorized = action.payload;
      if (!isAuthorized) {
        localStorage.removeItem('token');
      }
      state.isAuthorized = action.payload;
    },
  },
});

export const { setIsAuthorized } = authSlice.actions;

export default authSlice.reducer;

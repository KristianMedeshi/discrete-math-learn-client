import { createSlice } from '@reduxjs/toolkit';

const initialState = { userId: localStorage.getItem('userId') };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserId(state, action) {
      state.userId = action.payload;
    },
  },
});

export const { setUserId } = authSlice.actions;

export default authSlice.reducer;

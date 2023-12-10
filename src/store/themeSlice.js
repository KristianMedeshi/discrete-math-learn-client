import { createSlice } from '@reduxjs/toolkit';

const initialState = { isDark: localStorage.getItem('theme') === 'dark' };

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeIsDark(state, action) {
      state.isDark = action.payload;
    },
  },
});

export const { setThemeIsDark } = themeSlice.actions;

export default themeSlice.reducer;

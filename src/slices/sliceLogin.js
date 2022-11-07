import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosPrivate } from '../common/axiosPrivate';

// First, create the thunk
const login = createAsyncThunk('login/login', async (username, thunkAPI) => {
  const response = await axiosPrivate.post('/login', { username });
  return response.data;
});

const logout = createAsyncThunk('login/logout', async () => {
  const response = await axiosPrivate.delete('/logout');
  return response.data;
});

const storageData = JSON.parse(localStorage.getItem('session') || '{}');

const accessToken =
  (typeof storageData === 'object' && storageData.accessToken) || '';
const refreshToken =
  (typeof storageData === 'object' && storageData.refreshToken) || '';

const initialState = {
  accessToken,
  refreshToken,
  isLogged: !!refreshToken,
};

// Then, handle actions in your reducers:
const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder
      .addCase(login.fulfilled, (state, action) => {
        // Add user to the state array
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem(
          'session',
          JSON.stringify({
            accessToken: state.accessToken,
            refreshToken: state.refreshToken,
          })
        );
        state.isLogged = true;
      })
      .addCase(logout.fulfilled, (state, payload) => {
        state.accessToken = '';
        state.refreshToken = '';
        state.isLogged = false;
        localStorage.removeItem('session');
      });
  },
});

export { login, logout };
export default loginSlice.reducer;

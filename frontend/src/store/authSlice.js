import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api.js';

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data);
    localStorage.setItem('userInfo', JSON.stringify(res.data));
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('userInfo', JSON.stringify(res.data));
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('userInfo')) || null,
    loading: false,
    error: null,
    isModalOpen: false, // ✅ Added for popup
    modalMode: 'login', // 'login' or 'register'
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('userInfo');
    },
    openAuthModal: (state, action) => {
      state.isModalOpen = true;
      state.modalMode = action.payload || 'login';
    },
    closeAuthModal: (state) => {
      state.isModalOpen = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { 
        state.loading = false; 
        state.user = action.payload; 
        state.isModalOpen = false; // Close modal on success
      })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { 
        state.loading = false; 
        state.user = action.payload; 
        state.isModalOpen = false; // Close modal on success
      })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { logout, openAuthModal, closeAuthModal } = authSlice.actions;
export default authSlice.reducer;
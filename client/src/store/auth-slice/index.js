import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isAuthenticated: false,
  user: null,
  email: null,      // store email for OTP
  otpMode: null,    // "register" or "forgot-password"
  otp: null,        // store entered OTP
  error: null,
  loading: false,
};

// --- Thunk (must come before slice) ---
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        withCredentials: true,
      });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      return res.data.message; // "Logged out successfully"
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// --- Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
      state.email = null;
      state.otpMode = null;
      state.otp = null;
    },
    loginFailure: (state, action) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
      state.email = null;
      state.otpMode = null;
      state.otp = null;
    },
    setResetEmail: (state, action) => {
      state.email = action.payload;
    },
    setOtpMode: (state, action) => {
      state.otpMode = action.payload;
    },
    setOtp: (state, action) => {
      state.otp = action.payload;
    },
    clearOtpData: (state) => {
      state.email = null;
      state.otpMode = null;
      state.otp = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        state.error = action.payload;
      })
        .addCase(logoutUser.fulfilled, (state) => {
        // Clear state when logout succeeds
        state.isAuthenticated = false;
        state.user = null;
        state.role = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // Use same logic as fetchCurrentUser rejected
        state.isAuthenticated = false;
        state.user = action.payload;
        state.role = action.payload;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  setResetEmail,
  setOtpMode,
  setOtp,
  clearOtpData,
} = authSlice.actions;

export default authSlice.reducer;

// --- Selectors ---
export const selectAuth = (state) => state.auth;
export const selectCurrentUserId = (state) => state.auth.user?._id;

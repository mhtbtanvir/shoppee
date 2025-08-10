import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  isAuthenticated: false,
  user: null,
  email: null,      // store email for OTP
  otpMode: null,    // "register" or "forgot-password"
  otp: null,        // store entered OTP
  error: null,
  loading: false,
};

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
      // clear OTP info on login success
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
      state.otpMode = action.payload; // e.g. "register" or "forgot-password"
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

export const selectAuth = (state) => state.auth;

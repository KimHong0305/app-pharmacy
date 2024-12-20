import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode";

export const register = createAsyncThunk(
  'user',
  async (userInfo, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post('/user', userInfo);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifySignUp = createAsyncThunk(
  'user/verify-email-signup',
  async (otp, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.put('/user/verify-email-signup', otp);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const userLogin = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/log-in', credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUserInfo = createAsyncThunk(
  'user/bio',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/user/bio', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/auth/logout', { token });

      localStorage.removeItem('token');

      return { message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgot-password',
  async (email, { rejectWithValue }) => {
    try {
      const { data } = await api.put('/user/forgot-password', { email });
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/reset-password',
  async (info, { rejectWithValue }) => {
    try {
      const { data } = await api.put('/user/reset-password', info);
      return data.message;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const loginGoogle = createAsyncThunk(
  'auth/loginGoogle',
  async (authCode, { rejectWithValue }) => {
    try {
      const response = await api.post(`/auth/outbound/authentication?code=${authCode}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const returnRole = (token) => {
  if (token) {
    try {
      const decodeToken = jwtDecode(token);
      const expireTime = new Date(decodeToken.exp * 1000);

      if (new Date() > expireTime) {
        console.log('Token hết hạn');
        localStorage.removeItem('accessToken')
        return '';
      } else {
        return decodeToken.scope;
      }
    } catch (error) {
      console.error('Lỗi giải mã token:', error);
      return '';
    }
  } else {
    return '';
  }
};

// Tạo slice cho auth
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    bio: null,
    loading: false,
    error: null,
    role: returnRole(localStorage.getItem('token')),
    successMessage :  '',
    errorMessage : '',
    successRegMessage :  '',
    errorRegMessage : '',
    successVerMessage :  '',
    errorVerMessage : '',
    successPassMessage :  '',
    errorPassMessage : '',
    successResetMessage : '',
    errorResetMessage : ''
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
      state.errorRegMessage = "";
      state.successRegMessage = "";
      state.errorVerMessage = "";
      state.successVerMessage = "";
      state.successPassMessage = '';
      state.errorPassMessage = '';
      state.successResetMessage = '';
      state.errorResetMessage = '';
    },
    clearUserBio: (state) => {
      state.bio = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.successRegMessage = action.payload.message;
    })
    .addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.errorRegMessage = action.payload.message;
    })
    .addCase(verifySignUp.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(verifySignUp.fulfilled, (state, action) => {
      state.loading = false;
      state.successVerMessage = action.payload.message;
      console.log("Success message:", state.successVerMessage);
    })
    .addCase(verifySignUp.rejected, (state, action) => {
      state.error = action.payload;
      console.log(state.error);
    })
    .addCase(userLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(userLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.result.authenticated;
      state.token = action.payload.result.token;
      state.successMessage = action.payload.message;
      state.redirectToHome = true;

      state.role = returnRole(action.payload.result.token);
      console.log(state.role);

      // Lưu token vào localStorage
      localStorage.setItem('token', action.payload.result.token);
    })
    .addCase(userLogin.rejected, (state, action) => {
      state.loading = false;
      state.errorMessage = action.payload.message;
      console.log('Login error:', action.payload.message);
    })
    .addCase(logout.fulfilled, (state, action) => {
      state.user = null;
      state.token = null;
      state.successMessage = '';
      state.message = action.payload.message;
      console.log(action.payload.message);
    })
    .addCase(logout.rejected, (state, action) => {
      state.error = action.payload;
      console.log('Login error:', action.payload);
    })
    .addCase(getUserInfo.fulfilled, (state, action) => {
      state.loading = false;
      state.bio = action.payload.result;
    })
    .addCase(getUserInfo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(forgotPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(forgotPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.successPassMessage = action.payload;
    })
    .addCase(forgotPassword.rejected, (state, action) => {
      state.error = action.payload;
      state.errorPassMessage = action.payload;
    })
    .addCase(resetPassword.pending, (state) => {
      state.loading = true;
    })
    .addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.successResetMessage = action.payload;
    })
    .addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.errorResetMessage = action.payload;
    })
    // Đăng nhập bằng Google
    .addCase(loginGoogle.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(loginGoogle.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.result.token;
      state.redirectToHome = true;

      state.role = returnRole(action.payload.result.token);

      localStorage.setItem('token', action.payload.result.token);
    })
    .addCase(loginGoogle.rejected, (state, action) => {
      state.loading = false;
    })
  },
});

export const { messageClear, clearUserBio } = authSlice.actions
export default authSlice.reducer;
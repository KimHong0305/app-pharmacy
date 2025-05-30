import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getUsers = createAsyncThunk(
    'admin/user',
    async ({ page = 0, size = 5 }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await api.get(`/user?page=${page}&size=${size}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getEmployees = createAsyncThunk(
    'admin/getEmployees',
    async ({ role = 'NURSE', size = 5 }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await api.get(`/employee?roleName=${role}&size=${size}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createEmployee = createAsyncThunk(
  "admin/createEmployee",
  async (newEmployee, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/employee', newEmployee, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateBio = createAsyncThunk(
    "user/updateBio",
    async (bio, { rejectWithValue }) => {
        try {
        const token = localStorage.getItem('token');
        const response = await api.put('/user/update-bio', bio, {
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

export const banUsers = createAsyncThunk(
    'admin/banUser',
    async (user, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.put(`/user/ban/${user}`, {}, {
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

export const unBanUsers = createAsyncThunk(
    'admin/unBanUser',
    async (user, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.put(`/user/unban/${user}`, {}, {
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

export const getEmployeeInfo = createAsyncThunk(
    'employee/bio',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/employee/info', {
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

const userSlice = createSlice({
    name: 'user',
    initialState: {
        allUsers: [],
        allEmployees: [],
        totalPages: 0,
        currentPage: 0,
        totalElements: 0,
        loading: false,
        error: null,
        message: '',
        bio: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // get All User
            .addCase(getUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.allUsers = action.payload.result.content;
                state.totalPages = action.payload.result.totalPages;
                state.currentPage = action.payload.result.pageable.pageNumber;
                state.totalElements = action.payload.result.totalElements;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getEmployees.pending, (state) => {
                state.loading = true;
            })
            .addCase(getEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.allEmployees = action.payload.result.content;
            })
            .addCase(getEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // tạo tài khoản
            .addCase(createEmployee.pending, (state) => {
                state.loading = true;
            })
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(createEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.message = action.payload.message;
            })
            // Ban người dùng
            .addCase(banUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(banUsers.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(banUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Gỡ Ban người dùng
            .addCase(unBanUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(unBanUsers.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(unBanUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Cập nhật bio
            .addCase(updateBio.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateBio.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateBio.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // info nhan vien
            .addCase(getEmployeeInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.bio = action.payload.result;
                localStorage.setItem('user_id', action.payload.result.id);
            })
            .addCase(getEmployeeInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default userSlice.reducer;

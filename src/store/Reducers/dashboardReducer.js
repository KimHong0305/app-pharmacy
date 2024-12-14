import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getTotalUser = createAsyncThunk(
    "/getTotalUser",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/home/admin/totalUser', {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            return response.data.result;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getTotalCompany = createAsyncThunk(
    "/getTotalCompany",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/home/admin/totalCompany', {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            return response.data.result;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getTotalProduct = createAsyncThunk(
    "/getTotalProduct",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/home/employee/totalProduct', {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            return response.data.result;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getTotalCategory = createAsyncThunk(
    "/getTotalCategory",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/home/admin/totalCategory', {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            return response.data.result;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        totalUser: 0,
        totalCompany: 0,
        totalProduct: 0,
        totalCategory: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTotalUser.fulfilled, (state, action) => {
            state.loading = false;
            state.totalUser = action.payload;
            })
            .addCase(getTotalCompany.fulfilled, (state, action) => {
                state.loading = false;
                state.totalCompany = action.payload;
            })
            .addCase(getTotalProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.totalProduct = action.payload;
            })
            .addCase(getTotalCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.totalCategory = action.payload;
            })
        
    },
});
  
  export default dashboardSlice.reducer;
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

// API lấy doanh thu theo ngày
export const getRevenueByDate = createAsyncThunk(
    "/getRevenueByDate",
    async (date, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`/home/admin/revenue/date?date=${date}`, {
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

// API lấy doanh thu theo tháng
export const getRevenueByMonth = createAsyncThunk(
    "/getRevenueByMonth",
    async (month, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`/home/admin/revenue/month?month=${month}`, {
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

// API lấy doanh thu theo năm
export const getRevenueByYear = createAsyncThunk(
    "/getRevenueByYear",
    async (year, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`/home/admin/revenue/year?year=${year}`, {
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

// API lấy doanh thu theo khoảng thời gian
export const getRevenueByRange = createAsyncThunk(
    "/getRevenueByRange",
    async ({ startDate, endDate }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`/home/admin/revenue/range?startDate=${startDate}&endDate=${endDate}`, {
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
        revenueByDate: 0,
        revenueByMonth: 0,
        revenueByYear: 0,
        revenueByRange: 0,
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
            .addCase(getRevenueByDate.fulfilled, (state, action) => {
                state.loading = false;
                state.revenueByDate = action.payload;
            })
            .addCase(getRevenueByMonth.fulfilled, (state, action) => {
                state.loading = false;
                state.revenueByMonth = action.payload;
            })
            .addCase(getRevenueByYear.fulfilled, (state, action) => {
                state.loading = false;
                state.revenueByYear = action.payload;
            })
            .addCase(getRevenueByRange.fulfilled, (state, action) => {
                state.loading = false;
                state.revenueByRange = action.payload;
            })
        
    },
});
  
  export default dashboardSlice.reducer;
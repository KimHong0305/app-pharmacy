import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getUsersByPhone = createAsyncThunk(
    'nurse/getUsersByPhone',
    async (sdt, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`/user/order/shop?phone=${sdt}`, {
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

export const createOrderShop = createAsyncThunk(
    'nurse/createOrderShop',
    async (order, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.post('/order/nurse', order, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.result;
        } catch (error) {
            console.error("Lỗi từ server:", error.response?.data || error.message);
            return rejectWithValue(error.response.data);
        }
    }
);

export const confirmOrder = createAsyncThunk(
    'nurse/confirmOrder',
    async (order, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.put('/order/nurse', order, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi từ server:", error.response?.data || error.message);
            return rejectWithValue(error.response.data);
        }
    }
);

const nurseSlice = createSlice({
    name: "nurse",
    initialState: {
        info: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(getUsersByPhone.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getUsersByPhone.fulfilled, (state, action) => {
            state.loading = false;
            state.info = action.payload;
        })
        .addCase(getUsersByPhone.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(createOrderShop.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createOrderShop.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(createOrderShop.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    },
});

export default nurseSlice.reducer;
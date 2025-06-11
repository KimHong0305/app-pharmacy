import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/api";

export const createOrderHomeUser = createAsyncThunk(
    'user/createOrderHomeUser',
    async (item, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.post('/order/home', item,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createOrderCartUser = createAsyncThunk(
    'user/createOrderCartUser',
    async (item, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.post('/order/cart', item,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getHistory = createAsyncThunk(
    "user/getHistory",
    async (_, { rejectWithValue }) => {
        try {
        const token = localStorage.getItem('token');
        const response = await api.get('/order/history', {
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

export const cancelOrder = createAsyncThunk(
    "user/cancelOrder",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.post(`/order/cancel?orderId=${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const receiverOrder = createAsyncThunk(
    "user/receiverOrder",
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.put(`/order/user/receiver/${id}`, {
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

const orderUserSlice = createSlice({
    name: "orderUser",
    initialState: {
        loading: false,
        error: null,
        orderDetails: null,
        history: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Home
            .addCase(createOrderHomeUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.paymentUrl = null;
            })
            .addCase(createOrderHomeUser.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload.result;
            })
            .addCase(createOrderHomeUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Cart
            .addCase(createOrderCartUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.paymentUrl = null;
            })
            .addCase(createOrderCartUser.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload.result;
            })
            .addCase(createOrderCartUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // get history
            .addCase(getHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload;
            })
            .addCase(getHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default orderUserSlice.reducer;


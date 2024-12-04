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

const orderUserSlice = createSlice({
    name: "orderUser",
    initialState: {
        loading: false,
        error: null,
        orderDetails: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
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
            });
    },
});

export default orderUserSlice.reducer;


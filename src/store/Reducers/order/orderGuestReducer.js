import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/api";
import api_cartGuest from "../../../api/api_cartGuest";

export const createOrderHomeGuest = createAsyncThunk(
    'guest/createOrderHomeGuest',
    async (item, { rejectWithValue }) => {
        try {
            const response = await api.post('/order/guest/home', item);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createOrderCartGuest = createAsyncThunk(
    'guest/createOrderCartGuest',
    async (item, { rejectWithValue }) => {
        try {
            const response = await api_cartGuest.post('/order/guest/cart', item);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getOrder = createAsyncThunk(
    'guest/getOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/order/${orderId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const orderGuestSlice = createSlice({
    name: "orderGuest",
    initialState: {
        order: [],
        loading: false,
        error: null,
        orderDetails: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Home
            .addCase(createOrderHomeGuest.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.paymentUrl = null;
            })
            .addCase(createOrderHomeGuest.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload.result;
            })
            .addCase(createOrderHomeGuest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Cart
            .addCase(createOrderCartGuest.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.paymentUrl = null;
            })
            .addCase(createOrderCartGuest.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload.result;
            })
            .addCase(createOrderCartGuest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // get order
            .addCase(getOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrder.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(getOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default orderGuestSlice.reducer;


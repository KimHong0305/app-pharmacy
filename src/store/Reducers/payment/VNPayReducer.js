import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/api";

export const createPaymentVNPay = createAsyncThunk(
    'user/createVNPay',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await api.post(
                `/vnpay/create-payment/web?orderId=${orderId}`,
                null
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const vnPaySlice = createSlice({
    name: "VNPay",
    initialState: {
        loading: false,
        error: null,
        paymentUrl: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createPaymentVNPay.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.paymentUrl = null;
            })
            .addCase(createPaymentVNPay.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentUrl = action.payload.result;
            })
            .addCase(createPaymentVNPay.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default vnPaySlice.reducer;

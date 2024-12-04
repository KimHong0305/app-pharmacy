import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/api";

export const createPaymentZaloPay = createAsyncThunk(
    'user/createZaloPay',
    async (orderId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.post(
                `/zalopay/create-payment?orderId=${orderId}`,
                null,
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

const ZaloPaySlice = createSlice({
    name: "zaloPay",
    initialState: {
        loading: false,
        error: null,
        paymentUrl: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createPaymentZaloPay.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.paymentUrl = null;
            })
            .addCase(createPaymentZaloPay.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentUrl = action.payload.result;
            })
            .addCase(createPaymentZaloPay.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default ZaloPaySlice.reducer;

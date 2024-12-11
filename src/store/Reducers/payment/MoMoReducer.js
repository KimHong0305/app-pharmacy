import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/api";

export const createPaymentMoMo = createAsyncThunk(
    'user/createMoMo',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await api.post(
                `/momo/create-payment?orderId=${orderId}`,
                null
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const MoMoSlice = createSlice({
    name: "MoMo",
    initialState: {
        loading: false,
        error: null,
        paymentUrl: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createPaymentMoMo.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.paymentUrl = null;
            })
            .addCase(createPaymentMoMo.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentUrl = action.payload.result;
            })
            .addCase(createPaymentMoMo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default MoMoSlice.reducer;

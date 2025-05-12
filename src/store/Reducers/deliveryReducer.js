import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getService = createAsyncThunk(
    'delivery/getService',
    async (to_district, { rejectWithValue }) => {
        try {
            const response = await api.post('/delivery/service', {to_district});
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

export const getServiceFee = createAsyncThunk(
    'delivery/getServiceFee',
    async (info, { rejectWithValue }) => {
        try {
            const response = await api.post('/delivery/calculate/fee', info);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response);
        }
    }
);

const deliverySlice = createSlice({
    name: 'delivery',
    initialState: {
        service: [],
        fee: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearFee: (state) => {
            state.fee = 0;
        }
    },
    extraReducers: (builder) => {
        builder
        // getService
        .addCase(getService.pending, (state) => {
            state.loading = true;
        })
        .addCase(getService.fulfilled, (state, action) => {
            state.loading = false;
            state.service = action.payload;
        })
        .addCase(getService.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        // getServiceFee
        .addCase(getServiceFee.pending, (state) => {
            state.loading = true;
        })
        .addCase(getServiceFee.fulfilled, (state, action) => {
            state.loading = false;
            state.fee = action.payload;
        })
        .addCase(getServiceFee.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    },
});

export default deliverySlice.reducer;
export const { clearFee } = deliverySlice.actions;
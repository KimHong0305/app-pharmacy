import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/api";

export const getOrders = createAsyncThunk(
    "user/getOrders",
    async (_, { rejectWithValue }) => {
        try {
        const token = localStorage.getItem('token');
        const response = await api.get('/order', {
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

const orderAdminSlice = createSlice({
    name: "orderAdmin",
    initialState: {
        loading: false,
        error: null,
        orders: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default orderAdminSlice.reducer;


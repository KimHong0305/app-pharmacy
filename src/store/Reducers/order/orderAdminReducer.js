import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/api";

export const getOrders = createAsyncThunk(
    "user/getOrders",
    async ({page = 0, size = 5}, { rejectWithValue }) => {
        try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/order?page=${page}&size=${size}`, {
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
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
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
                state.orders = action.payload.content;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default orderAdminSlice.reducer;


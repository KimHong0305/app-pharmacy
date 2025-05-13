import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/api";

export const updateCallBack = createAsyncThunk(
    "payment/updateCallback",
    async ({ orderId, code }, { rejectWithValue }) => {
        try {
            const response = await api.post("/callback", { orderId, code });
            return response.data.result;
        } catch (error) {
            const message = error.response?.data || error.message || "Unknown error";
            return rejectWithValue(message);
        }
    }
);

const callbackSlice = createSlice({
    name: "callback",
    initialState: {
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateCallBack.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCallBack.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updateCallBack.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default callbackSlice.reducer;
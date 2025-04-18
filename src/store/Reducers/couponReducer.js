import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getCouponUser = createAsyncThunk(
    'coupon/getCouponUser',
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/coupon/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );

const couponSlice = createSlice({
    name: 'coupon',
    initialState: {
        coupons: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // get User Coupon
            .addCase(getCouponUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCouponUser.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons = action.payload.result;
            })
            .addCase(getCouponUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default couponSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getCouponUser = createAsyncThunk(
    'coupon/getCouponUser',
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/coupon/user`, {
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

export const getCouponById = createAsyncThunk(
    'coupon/getCouponById',
    async (id, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/coupon/user/id?couponId=${id}`, {
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

export const getCoupon = createAsyncThunk(
  'coupon/getCoupon',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/coupon', {
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

export const createCoupon = createAsyncThunk(
  "coupon/createCoupon",
  async (newCoupon, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/coupon', newCoupon, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCoupon = createAsyncThunk(
  "coupon/updateCoupon",
  async (coupon, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put('/coupon', coupon, {
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

export const deleteCoupon = createAsyncThunk(
  "coupon/deleteCoupon",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.delete(`/coupon/${id}`, {
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
        coupon: {},
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
            // get by Id
            .addCase(getCouponById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCouponById.fulfilled, (state, action) => {
                state.loading = false;
                state.coupon = action.payload;
            })
            .addCase(getCouponById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // #region ADMIN
            .addCase(getCoupon.pending, (state) => {
              state.loading = true;
            })
            .addCase(getCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.coupons = action.payload.result;
            })
            .addCase(getCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create
            .addCase(createCoupon.pending, (state) => {
              state.loading = true;
            })
            .addCase(createCoupon.fulfilled, (state, action) => {
              state.loading = false;
            })
            .addCase(createCoupon.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
            })

            // Update
            .addCase(updateCoupon.pending, (state) => {
              state.loading = true;
            })
            .addCase(updateCoupon.fulfilled, (state, action) => {
              state.loading = false;
            })
            .addCase(updateCoupon.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
            })

            // Delete
            .addCase(deleteCoupon.pending, (state) => {
              state.loading = true;
            })
            .addCase(deleteCoupon.fulfilled, (state, action) => {
              state.loading = false;
            })
            .addCase(deleteCoupon.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
            })
    },
});

export default couponSlice.reducer;

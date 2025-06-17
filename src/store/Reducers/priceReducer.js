import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getAllPrices = createAsyncThunk(
  "price/getAllPrices",
  async ({ page = 0, size = 300 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/price?page=${page}&size=${size}`);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createPrice = createAsyncThunk(
  "price/createPrice",
  async (item, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/price', item, {
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

export const updatePrice = createAsyncThunk(
  "price/updatePrice",
  async (price, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put('/price', price, {
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

export const deletePrice = createAsyncThunk(
  "price/deletePrice",
  async (priceId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.delete(`/price/${priceId}`, {
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

const priceSlice = createSlice({
  name: "price",
  initialState: {
    prices: [],
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    messageClear: (state, _) => {
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Price
      .addCase(getAllPrices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPrices.fulfilled, (state, action) => {
        state.loading = false;
        state.prices = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.currentPage = action.payload.number;
      })
      .addCase(getAllPrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Price
      .addCase(createPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPrice.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Edit Price
      .addCase(updatePrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePrice.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(updatePrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default priceSlice.reducer;

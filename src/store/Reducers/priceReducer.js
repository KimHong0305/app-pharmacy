import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const token = localStorage.getItem('token');

export const getAllPrices = createAsyncThunk(
  "unit/getAllPrices",
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/price?page=${page}&size=${size}`);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const companySlice = createSlice({
  name: "price",
  initialState: {
    prices: [],
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
  },
});

export default companySlice.reducer;

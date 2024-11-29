import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getAllProducts = createAsyncThunk(
  'product/fetchProducts',
  async ({ page = 0, size = 10, sortOrder = 'asc' }, { rejectWithValue }) => {
    try {
      const response = await api.get(`product?page=${page}&size=${size}&sortOrder=${sortOrder}`);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const getProductById = createAsyncThunk(
  'product/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/product/${productId}`);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getProductByCategory = createAsyncThunk(
  'product/fetchProductByCategory',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/product/category/${categoryId}`);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    allProducts: [],
    products: [],
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    product: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.content;
        state.allProducts = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProductByCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.content;
      })
      .addCase(getProductByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default productSlice.reducer;
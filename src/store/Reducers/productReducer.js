import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getAllProducts = createAsyncThunk(
  'product/fetchProducts',
  async ({ page = 0, size = 1000, sortOrder = 'asc' }, { rejectWithValue }) => {
    try {
      const response = await api.get(`product?page=${page}&size=${size}&sortOrder=${sortOrder}`);
      // console.log(response.data.result)
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
  async ({ page = 0, size = 1000, categoryId, sortOrder = 'asc' }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/product/category/${categoryId}`, {
        params: { page, size, sortOrder },
      });
      return data.result;
    } catch (error) {
      const errorMessage = error.response?.data || 'An unexpected error occurred';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (newProduct, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/product', newProduct, {
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

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (product, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put('/product', product, {
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

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.delete(`/product/${productId}`, {
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

const productSlice = createSlice({
  name: 'product',
  initialState: {
    allProducts: [],
    newProducts: [],
    bestProducts: [],
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
      // get All
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.allProducts = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get by Id
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
      // Get by category
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
      })
      // create
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // xoa san pham
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
});

export default productSlice.reducer;
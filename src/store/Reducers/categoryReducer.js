import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getCategoryNull = createAsyncThunk(
  "category/null",
  async (_, { fulfillWithValue }) => {
    try {
      const { data } = await api.get("/category/null");
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const getAllCategory = createAsyncThunk(
  "category",
  async (_, { fulfillWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.get("/category", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return fulfillWithValue(data);
    } catch (error) {
      console.log(error.response);
    }
  }
);

export const getChildCategory = createAsyncThunk(
  "category/child",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/category/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (newCategory, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/category', newCategory, {
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

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (category, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put('/category', category, {
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

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.delete(`/category/${categoryId}`, {
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

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    allCategory: [],
    childCategories: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get category null
      .addCase(getCategoryNull.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategoryNull.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.result;
        state.error = null;
      })
      .addCase(getCategoryNull.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Get category child
      .addCase(getChildCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getChildCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.childCategories = action.payload.result;
        state.error = null;
      })
      .addCase(getChildCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get all category
      .addCase(getAllCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allCategory = action.payload.result;
      })
      .addCase(getAllCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      // Tạo danh mục
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sửa danh mục
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Xóa danh mục
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
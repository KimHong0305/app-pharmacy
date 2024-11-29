import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const token = localStorage.getItem('token');

export const getCompanies = createAsyncThunk(
  "/getCompanies",
  async ({ page = 0, size = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/company?page=${page}&size=${size}`);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createCompany = createAsyncThunk(
  "/createCompany",
  async (newCompany, { rejectWithValue }) => {
    try {
      const response = await api.post('/company', newCompany, {
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

const companySlice = createSlice({
  name: "company",
  initialState: {
    companies: [],
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Lấy danh sách công ty
      .addCase(getCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.currentPage = action.payload.number;
      })
      .addCase(getCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Tạo công ty
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default companySlice.reducer;

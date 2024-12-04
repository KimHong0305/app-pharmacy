import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getUnits = createAsyncThunk(
  "unit/getUnits",
  async ({ page = 0, size = 5 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/unit?page=${page}&size=${size}`);
      return response.data.result;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createUnit = createAsyncThunk(
  "unit/createUnits",
  async (unitName, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/unit', unitName, {
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

export const updateUnit = createAsyncThunk(
  "unit/updateUnits",
  async (unit, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put('/unit', unit, {
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

export const deleteUnit = createAsyncThunk(
  "unit/deleteUnits",
  async (unitId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.delete(`/unit/${unitId}`, {
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

const unitSlice = createSlice({
  name: "unit",
  initialState: {
    units: [],
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUnits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUnits.fulfilled, (state, action) => {
        state.loading = false;
        state.units = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.currentPage = action.payload.number;
      })
      .addCase(getUnits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUnit.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUnit.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteUnit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUnit.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteUnit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default unitSlice.reducer;

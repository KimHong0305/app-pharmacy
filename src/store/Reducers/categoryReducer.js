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

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategoryNull.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategoryNull.fulfilled, (state, action) => {
        // console.log("Fetched categories:", action.payload);
        state.isLoading = false;
        state.categories = action.payload.result;
        state.error = null;
      })
      .addCase(getCategoryNull.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;
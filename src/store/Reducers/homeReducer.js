import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getHome = createAsyncThunk(
    "user/getHome",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/home/user');
            return response.data.result;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const homeSlice = createSlice({
    name: "home",
    initialState: {
        bestProducts: [],
        newProducts: [],
        topCompanies: [],
        loading: false,
        error: null,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
        .addCase(getHome.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getHome.fulfilled, (state, action) => {
            state.loading = false;
            state.newProducts = action.payload.newProducts;
            state.bestProducts = action.payload.topProducts;
            state.topCompanies = action.payload.topCompanies;
        })
        .addCase(getHome.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    },
});

export default homeSlice.reducer;
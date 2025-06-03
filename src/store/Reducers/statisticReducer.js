import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getStatisticYear = createAsyncThunk(
    "user/getStatisticYear",
    async (year, { rejectWithValue }) => {
        try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/user/spending/year?year=${year}`, {
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

export const getStatisticMonth = createAsyncThunk(
    "user/getStatisticMonth",
    async ({month, year}, { rejectWithValue }) => {
        try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/user/spending/month?month=${month}&year=${year}`, {
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


const statisticSlice = createSlice({
    name: 'statistic',
    initialState: {
        dataYear: [],
        dataMonth: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getStatisticYear.pending, (state) => {
                state.loading = true;
            })
            .addCase(getStatisticYear.fulfilled, (state, action) => {
                state.loading = false;
                state.dataYear = action.payload;
            })
            .addCase(getStatisticYear.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Month
            .addCase(getStatisticMonth.pending, (state) => {
                state.loading = true;
            })
            .addCase(getStatisticMonth.fulfilled, (state, action) => {
                state.loading = false;
                state.dataMonth = action.payload;
            })
            .addCase(getStatisticMonth.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default statisticSlice.reducer;

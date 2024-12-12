import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/api";

export const getAllFeedback = createAsyncThunk(
    "employee/getAllFeedback",
    async (_, { rejectWithValue }) => {
        try {
        const token = localStorage.getItem('token');
        const response = await api.get('/feedback/employee', {
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

export const createFeedback = createAsyncThunk(
    "employee/createFeedback",
    async (feedback, { rejectWithValue }) => {
        try {
        const token = localStorage.getItem('token');
        const response = await api.post('/feedback/employee', feedback, {
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

export const deleteFeedback = createAsyncThunk(
    "employee/deleteFeedback",
    async (id, { rejectWithValue }) => {
        try {
        const token = localStorage.getItem('token');
        const response = await api.delete(`/feedback/employee/${id}`, {
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

const feedbackEmployeeSlice = createSlice({
    name: "feedbackEmployee",
    initialState: {
        loading: false,
        error: null,
        allFeedback:[],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllFeedback.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllFeedback.fulfilled, (state, action) => {
                state.loading = false;
                state.allFeedback = action.payload;
            })
            .addCase(getAllFeedback.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // create
            .addCase(createFeedback.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFeedback.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(createFeedback.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // delete
            .addCase(deleteFeedback.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteFeedback.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(deleteFeedback.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default feedbackEmployeeSlice.reducer;
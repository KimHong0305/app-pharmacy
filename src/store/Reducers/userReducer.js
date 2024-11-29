import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

const token = localStorage.getItem('token');

export const getUsers = createAsyncThunk(
    'admin/user',
    async ({ page = 0, size = 10 }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get(`/user?page=${page}&size=${size}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        allUsers: [],
        totalPages: 0,
        currentPage: 0,
        totalElements: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.allUsers = action.payload.result.content;
                state.totalPages = action.payload.result.totalPages;
                state.currentPage = action.payload.result.pageable.pageNumber;
                state.totalElements = action.payload.result.totalElements;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default userSlice.reducer;

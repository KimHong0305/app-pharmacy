import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/api";

export const getRoomVacant = createAsyncThunk(
    "nurse/getRoomVacant",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get("/chat/room/vacant", {
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

export const chooseRoomVacant = createAsyncThunk(
    "nurse/chooseRoomVacant",
    async (roomId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.put("/chat/room/choose", { roomId }, {
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

export const historyChatRoom = createAsyncThunk(
    "nurse/historyChatRoom",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get("/chat/room/employee", {
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

const chatNurseSlice = createSlice({
    name: 'chat_nurse',
    initialState: {
        loading: false,
        error: null,
        rooms: [],
        roomsWait: [],
    },
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
        .addCase(historyChatRoom.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(historyChatRoom.fulfilled, (state, action) => {
            state.loading = false;
            state.roomsWait = action.payload.result;
        })
        .addCase(historyChatRoom.rejected, (state, action) => {
            state.loading = false;
        })
        .addCase(getRoomVacant.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getRoomVacant.fulfilled, (state, action) => {
            state.loading = false;
            state.rooms = action.payload.result;
        })
        .addCase(getRoomVacant.rejected, (state, action) => {
            state.loading = false;
        })
    },
});

export default chatNurseSlice.reducer;
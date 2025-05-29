import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/api";

export const createRoom = createAsyncThunk(
    "user/createRoom",
    async (content, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.post("/chat/create/room", content, {
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

export const createMessage = createAsyncThunk(
    "user/createMessage",
    async (message, { rejectWithValue }) => {
        try {
            const response = await api.post("/chat/create/message", message)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const historyChat = createAsyncThunk(
    "user/historyChat",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get("/chat/room/user", {
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

export const historyChatMessage = createAsyncThunk(
    "user/historyChatMessage",
    async (roomId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`/chat/room/message?roomId=${roomId}`, {
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

const chatUserSlice = createSlice({
    name: 'chat_user',
    initialState: {
        loading: false,
        error: null,
        chats: [],
        oldMessages: [],
    },
    reducers: {
        
    },
    extraReducers: (builder) => {
        builder
        .addCase(createRoom.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createRoom.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(createRoom.rejected, (state, action) => {
            state.loading = false;
        })
        .addCase(createMessage.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createMessage.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(createMessage.rejected, (state, action) => {
            state.loading = false;
        })
        .addCase(historyChat.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(historyChat.fulfilled, (state, action) => {
            state.loading = false;
            state.chats = action.payload.result;
        })
        .addCase(historyChat.rejected, (state, action) => {
            state.loading = false;
        })
        .addCase(historyChatMessage.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(historyChatMessage.fulfilled, (state, action) => {
            state.loading = false;
            state.oldMessages = action.payload.result;
        })
        .addCase(historyChatMessage.rejected, (state, action) => {
            state.loading = false;
        })
    },
});

export default chatUserSlice.reducer;
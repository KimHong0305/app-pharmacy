import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../api/api";

// Lấy feedback theo sản phẩm
export const getFeedbackByProduct = createAsyncThunk(
    "/getFeedbackByProduct",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/feedback/null/${productId}`);
            console.log("Response feedback by product: ", response.data.result);
            return response.data.result;
        } catch (error) {
            console.error("Error getting feedback by product: ", error);
            return rejectWithValue(error.response?.data);
        }
    }
);

// Lấy reply feedback
export const getReplyFeedback = createAsyncThunk(
    "/getReplyFeedback",
    async (feedbackId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/feedback/${feedbackId}`);
            const result = response?.data?.result?.[0];
            console.log("Reply feedback API response: ", result);

            if (result) {
                return {
                    feedbackId,
                    reply: result?.feedback ?? null,
                    username: result?.username ?? null,
                    avatar: result?.parent?.avatar ?? null,
                    createDate: result?.parent?.createDate ?? null,
                };
            }
            return {
                feedbackId,
                reply: null,
                username: null,
                avatar: null,
                createDate: null,
            };
        } catch (error) {
            console.error("Error fetching reply feedback: ", error);
            return rejectWithValue(error.response?.data);
        }
    }
);

// Gửi feedback mới
export const createFeedback = createAsyncThunk(
    "user/createFeedback",
    async (feedback, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.post('/feedback', feedback, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Feedback created response: ", response.data.result);
            return response.data.result;
        } catch (error) {
            console.error("Error creating feedback: ", error);
            return rejectWithValue(error.response?.data);
        }
    }
);

// Slice
const feedbackSlice = createSlice({
    name: "feedback",
    initialState: {
        loading: false,
        error: null,
        feedbacks: [],
        reply: {},
    },
    reducers: {
        // Set reply thông qua Redux state
        setReply: (state, action) => {
            const { feedbackId, reply, username, avatar, createDate } = action.payload;
            state.reply[feedbackId] = { reply, username, avatar, createDate };
        },
    },
    extraReducers: (builder) => {
        builder
            // Load feedback by product
            .addCase(getFeedbackByProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFeedbackByProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.feedbacks = action.payload;
                console.log("Feedbacks loaded: ", action.payload);
            })
            .addCase(getFeedbackByProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error("Error loading feedbacks: ", action.payload);
            })
            // Load reply feedback
            .addCase(getReplyFeedback.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getReplyFeedback.fulfilled, (state, action) => {
                state.loading = false;
                const { feedbackId, reply, username, avatar, createDate } = action.payload;

                if (reply) {
                    state.reply[feedbackId] = {
                        reply,
                        username,
                        avatar,
                        createDate,
                    };
                }
                console.log("Stored reply: ", state.reply);
            })
            .addCase(getReplyFeedback.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error("Error loading reply feedback: ", action.payload);
            })
            // Handle create feedback
            .addCase(createFeedback.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createFeedback.fulfilled, (state, action) => {
                state.loading = false;
                console.log("Feedback created successfully: ", action.payload);
            })
            .addCase(createFeedback.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                console.error("Error while creating feedback: ", action.payload);
            });
    },
});

export default feedbackSlice.reducer;
export const { setReply } = feedbackSlice.actions;

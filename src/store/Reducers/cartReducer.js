import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api_cartGuest from "../../api/api_cartGuest";
import api from "../../api/api";

export const addCartGuest = createAsyncThunk(
    "guest/add_cart",
    async (item, { rejectWithValue }) => {
        try {
            const response = await api_cartGuest.post("/cart/guest", item);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getCartGuest = createAsyncThunk(
    "guest/cart",
    async (_, { rejectWithValue }) => {
        try {
            const cartResponse = await api_cartGuest.get("/cart/guest");
            console.log(cartResponse.data)
            return cartResponse.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateCartGuest = createAsyncThunk(
    "guest/updateCart",
    async (itemUpdate, { rejectWithValue }) => {
        try {
            const response = await api_cartGuest.put("/cart/guest", itemUpdate);
            console.log(response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteCartGuest = createAsyncThunk(
    "guest/deleteCart",
    async (itemDelete, { rejectWithValue }) => {
        try {
            const response = await api_cartGuest.delete("/cart/guest", { data: itemDelete });
            console.log('xoa', response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const addCartUser = createAsyncThunk(
    "user/add_cart",
    async (item, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.post("/cart", item, {
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

export const getCartUser = createAsyncThunk(
    "user/cart",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const cartResponse = await api.get("/cart", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return cartResponse.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateCartUser = createAsyncThunk(
    "user/updateCart",
    async (itemUpdate, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.put("/cart", itemUpdate, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteCartUser = createAsyncThunk(
    "user/deleteCart",
    async (itemDelete, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.delete("/cart", { data: itemDelete ,
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

export const transfer = createAsyncThunk(
    "transfer",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const cartResponse = await api_cartGuest.post("/cart/transfer", null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Chuyển thành công');
            return cartResponse.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: [],
        totalPrice: 0,
        loading: false,
        error: null,
        message: null,
        messageError: null,
        messageCart: null,
        messageUpdate: null,
        messageDelete: null,
    },
    reducers: {
        messageClear: (state) => {
            state.messageError = "";
            state.message = "";
            state.messageCart = "";
            state.messageUpdate = "";
            state.messageDelete = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addCartGuest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCartGuest.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(addCartGuest.rejected, (state, action) => {
                state.loading = false;
                state.messageError = action.payload.message;
            })
            .addCase(getCartGuest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCartGuest.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload;
                if (data.result) {
                    state.cartItems = data.result.cartItemResponses || [];
                    state.totalPrice = data.result.totalPrice || 0;
                    console.log(data.result)
                } else {
                    state.cartItems = [];
                    state.totalPrice = 0;
                    state.messageCart = data.message;
                }
            })
            .addCase(getCartGuest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateCartGuest.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartGuest.fulfilled, (state, action) => {
                state.loading = false;
                state.messageUpdate = action.payload.message;
            })
            .addCase(updateCartGuest.rejected, (state, action) => {
                state.loading = false;
                state.messageError = action.payload.message;
            })
            .addCase(deleteCartGuest.fulfilled, (state, action) => {
                state.loading = false;
                state.messageDelete = action.payload.message;
            })
            .addCase(deleteCartGuest.rejected, (state, action) => {
                state.loading = false;
                console.log(action.payload.message)
            })
            .addCase(addCartUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCartUser.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(addCartUser.rejected, (state, action) => {
                state.loading = false;
                state.messageError = action.payload.message;
            })
            .addCase(getCartUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCartUser.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload;
                if (data.result) {
                    state.cartItems = data.result.cartItemResponses  || [];
                    state.totalPrice = data.result.totalPrice || 0;
                } else {
                    state.cartItems = [];
                    state.totalPrice = 0;
                    state.messageCart = data.message;
                }
            })
            .addCase(getCartUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateCartUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartUser.fulfilled, (state, action) => {
                state.loading = false;
                state.messageUpdate = action.payload.message;
            })
            .addCase(updateCartUser.rejected, (state, action) => {
                state.loading = false;
                state.messageError = action.payload.message;
            })
            .addCase(deleteCartUser.fulfilled, (state, action) => {
                state.loading = false;
                state.messageDelete = action.payload.message;
            })
            .addCase(deleteCartUser.rejected, (state, action) => {
                state.loading = false;
                console.log(action.payload.message)
            })
            .addCase(transfer.fulfilled, (state, action) => {
                state.loading = false;
                console.log('chuyen thanh cong')
            });
    },
});

export const { messageClear } = cartSlice.actions;
export default cartSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

export const getAddress = createAsyncThunk(
    "user/getAddress",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/address', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            const updatedAddresses = await Promise.all(
                response.data.result.map(async (addr) => {
                    const { province, district, village } = addr;
                    const detailResponse = await api.get(`/address/detail?provinceId=${province}&districtId=${district}&wardCode=${village}`);
                    return {
                        ...addr,
                        provinceName: detailResponse.data.result.province.ProvinceName,
                        districtName: detailResponse.data.result.district.DistrictName,
                        wardName: detailResponse.data.result.ward.WardName,
                    };
                })
            );

            return updatedAddresses;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch addresses');
        }
    }
);

export const createAddress = createAsyncThunk(
    "user/createAddress",
    async (newAddress, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.post('/address', newAddress, {
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

export const updateAddress = createAsyncThunk(
    "user/updateAddress",
    async (update, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.put('/address', update, {
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

export const deleteAddress = createAsyncThunk(
    "user/deleteAddress",
    async (Id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.delete(`/address/${Id}`, {
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

export const getAddressDetail = createAsyncThunk(
    'address/getDetail',
    async ({ provinceId, districtId, wardCode }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/address/detail?provinceId=${provinceId}&districtId=${districtId}&wardCode=${wardCode}`);
            return response.data.result;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch address details');
        }
    }
);

const addressSlice = createSlice({
    name: "address",
    initialState: {
      address: [],
      addressDetail: null,
      loading: false,
      error: null,
    },
    reducers: {
        clearAddress: (state) => {
            state.address = [];
        }
    },
    extraReducers: (builder) => {
        builder
        // get địa chỉ
        .addCase(getAddress.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAddress.fulfilled, (state, action) => {
            state.loading = false;
            state.address = action.payload;
        })
        .addCase(getAddress.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        // tạo địa chỉ
        .addCase(createAddress.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createAddress.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(createAddress.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        // cập nhật địa chỉ
        .addCase(updateAddress.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateAddress.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(updateAddress.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        // Xóa địa chỉ
        .addCase(deleteAddress.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteAddress.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(deleteAddress.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        // Chi tiết địa chỉ
        .addCase(getAddressDetail.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAddressDetail.fulfilled, (state, action) => {
            state.loading = false;
            state.addressDetail = action.payload;
        })
        .addCase(getAddressDetail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    },
});

export default addressSlice.reducer;
export const { clearAddress } = addressSlice.actions;
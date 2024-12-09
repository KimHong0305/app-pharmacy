import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import { getProvinceName, getDistrictName, getVillageName } from "./locationReducer";

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
        return response.data.result;
        } catch (error) {
        return rejectWithValue(error.response.data);
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

// Fetch và bổ sung tên địa phương
export const fetchAddressWithLocationNames = createAsyncThunk(
    "address/fetchAddressWithLocationNames",
    async (address, { dispatch, rejectWithValue }) => {
      try {
        if (Array.isArray(address)) {
          // Nếu là mảng địa chỉ
          const updatedAddresses = await Promise.all(
            address.map(async (addr) => {
              const [provinceName, districtName, villageName] = await Promise.all([
                dispatch(getProvinceName(addr.province)).unwrap(),
                dispatch(getDistrictName(addr.district)).unwrap(),
                dispatch(getVillageName(addr.village)).unwrap(),
              ]);
  
              return {
                ...addr,
                provinceName,
                districtName,
                villageName,
              };
            })
          );
  
          return updatedAddresses;
        } else {
          // Nếu chỉ là một địa chỉ đơn lẻ
          const [provinceName, districtName, villageName] = await Promise.all([
            dispatch(getProvinceName(address.province)).unwrap(),
            dispatch(getDistrictName(address.district)).unwrap(),
            dispatch(getVillageName(address.village)).unwrap(),
          ]);
  
          return {
            ...address,
            provinceName,
            districtName,
            villageName,
          };
        }
      } catch (error) {
        return rejectWithValue("Failed to fetch location names.");
      }
    }
);

const addressSlice = createSlice({
    name: "address",
    initialState: {
      address: [],
      updateAddress: [],
      loading: false,
      error: null,
    },
    reducers: {},
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
        // Bổ sung tên địa phương
        .addCase(fetchAddressWithLocationNames.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAddressWithLocationNames.fulfilled, (state, action) => {
            state.loading = false;
            state.updateAddress = action.payload;
        })
        .addCase(fetchAddressWithLocationNames.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export default addressSlice.reducer;
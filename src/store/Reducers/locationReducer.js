import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";


export const getProvinces = createAsyncThunk(
    'location/getProvinces',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/delivery/province');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const getDistricts = createAsyncThunk(
    'location/getDistricts',
    async (province_id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/delivery/district?provinceId=${province_id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch districts');
        }
    }
);

export const getVillages = createAsyncThunk(
    'location/getVillages',
    async (district_id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/delivery/ward?districtId=${district_id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch districts');
        }
    }
);

const locationSlice = createSlice({
    name: "location",
    initialState: {
        provinces: [],
        districts: [],
        villages: [],
        provinceName: "",
        districtName: "",
        villageName: "",
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Xử lý tỉnh thành
            .addCase(getProvinces.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProvinces.fulfilled, (state, action) => {
                state.loading = false;
                state.provinces = action.payload;
            })
            .addCase(getProvinces.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Xử lý quận huyện
            .addCase(getDistricts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDistricts.fulfilled, (state, action) => {
                state.loading = false;
                state.districts = action.payload;
            })
            .addCase(getDistricts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Xử lý phường xã
            .addCase(getVillages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getVillages.fulfilled, (state, action) => {
                state.loading = false;
                state.villages = action.payload;
            })
            .addCase(getVillages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
    },
});

export default locationSlice.reducer;

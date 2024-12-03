import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://provinces.open-api.vn";

// Get provinces
export const getProvinces = createAsyncThunk(
    'location/getProvinces',
    async () => {
        const response = await axios.get(`${API_BASE_URL}/api/p/`);
        return response.data;
    }
);

// Get districts (with province code)
export const getDistricts = createAsyncThunk(
    'location/getDistricts',
    async (provinceCode) => {
        const response = await axios.get(`${API_BASE_URL}/api/d/`, {
            params: { province: provinceCode }
        });
        return response.data;
    }
);

// Get villages (with district code)
export const getVillages = createAsyncThunk(
    'location/getVillages',
    async (districtCode) => {
        const response = await axios.get(`${API_BASE_URL}/api/w/`, {
            params: { district: districtCode }
        });
        return response.data;
    }
);

const locationSlice = createSlice({
    name: "location",
    initialState: {
        provinces: [],
        districts: [],
        villages: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handling Provinces
            .addCase(getProvinces.pending, (state) => {
                state.loading = true;
                state.error = null;  // Reset error state when request starts
            })
            .addCase(getProvinces.fulfilled, (state, action) => {
                state.loading = false;
                state.provinces = action.payload;
            })
            .addCase(getProvinces.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;  // Capture error message
            })
            
            // Handling Districts
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
            
            // Handling Villages
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
            });
    }
});

export default locationSlice.reducer;

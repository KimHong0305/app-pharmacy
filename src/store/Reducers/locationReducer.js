import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://esgoo.net";

// Lấy danh sách tỉnh thành
export const getProvinces = createAsyncThunk(
    'location/getProvinces',
    async () => {
        const response = await axios.get(`${API_BASE_URL}/api-tinhthanh/1/0.htm`);
        if (response.data.error === 0) {
            return response.data.data;
        } else {
            throw new Error("Failed to fetch provinces");
        }
    }
);

// Lấy danh sách quận huyện theo ID tỉnh
export const getDistricts = createAsyncThunk(
    'location/getDistricts',
    async (provinceId) => {
        const response = await axios.get(`${API_BASE_URL}/api-tinhthanh/2/${provinceId}.htm`);
        if (response.data.error === 0) {
            return response.data.data;
        } else {
            throw new Error("Failed to fetch districts");
        }
    }
);

// Lấy danh sách phường xã theo ID quận
export const getVillages = createAsyncThunk(
    'location/getVillages',
    async (districtId) => {
        const response = await axios.get(`${API_BASE_URL}/api-tinhthanh/3/${districtId}.htm`);
        if (response.data.error === 0) {
            return response.data.data;
        } else {
            throw new Error("Failed to fetch villages");
        }
    }
);

// Lấy Tên Tỉnh
export const getProvinceName = createAsyncThunk(
    'location/getProvinceName',
    async (provinceId) => {
        const response = await axios.get(`${API_BASE_URL}/api-tinhthanh/5/${provinceId}.htm`);
        if (response.data.error === 0) {
            return response.data.data.full_name; // Lấy tên tỉnh từ dữ liệu trả về
        } else {
            throw new Error("Failed to fetch province name");
        }
    }
);

// Lấy Tên Quận
export const getDistrictName = createAsyncThunk(
    'location/getDistrictName',
    async (districtId) => {
        const response = await axios.get(`${API_BASE_URL}/api-tinhthanh/5/${districtId}.htm`);
        if (response.data.error === 0) {
            return response.data.data.full_name; // Lấy tên quận từ dữ liệu trả về
        } else {
            throw new Error("Failed to fetch district name");
        }
    }
);

// Lấy Tên Phường
export const getVillageName = createAsyncThunk(
    'location/getVillageName',
    async (villageId) => {
        const response = await axios.get(`${API_BASE_URL}/api-tinhthanh/5/${villageId}.htm`);
        if (response.data.error === 0) {
            return response.data.data.full_name; // Lấy tên phường từ dữ liệu trả về
        } else {
            throw new Error("Failed to fetch village name");
        }
    }
);

// Slice xử lý trạng thái location
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
            // Xử lý lấy tên tỉnh
            .addCase(getProvinceName.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProvinceName.fulfilled, (state, action) => {
                state.loading = false;
                state.provinceName = action.payload;
            })
            .addCase(getProvinceName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Xử lý lấy tên quận
            .addCase(getDistrictName.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDistrictName.fulfilled, (state, action) => {
                state.loading = false;
                state.districtName = action.payload;
            })
            .addCase(getDistrictName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Xử lý lấy tên phường
            .addCase(getVillageName.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getVillageName.fulfilled, (state, action) => {
                state.loading = false;
                state.villageName = action.payload;
            })
            .addCase(getVillageName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default locationSlice.reducer;

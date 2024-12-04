import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProvinces, getDistricts, getVillages } from '../../../store/Reducers/locationReducer';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { IoReturnDownBackSharp } from "react-icons/io5";
import { toast } from 'react-toastify';
import { createAddress } from '../../../store/Reducers/addressReducer';

const AddAddress = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { provinces, districts, villages, loading } = useSelector((state) => state.location);

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedVillage, setSelectedVillage] = useState(null);
    const [addressType, setAddressType] = useState('Nhà riêng');
    const [isDefault, setIsDefault] = useState(false);

    useEffect(() => {
        dispatch(getProvinces());
    }, [dispatch]);

    const handleProvinceChange = async (e) => {
        const provinceId = Number(e.target.value);
        setSelectedProvince(provinceId);
        setSelectedDistrict(null);
        setSelectedVillage(null);

        if (provinceId) {
            await dispatch(getDistricts(provinceId));
        }
    };

    const handleDistrictChange = async (e) => {
        const districtId = Number(e.target.value);
        setSelectedDistrict(districtId);
        setSelectedVillage(null);

        if (districtId) {
            await dispatch(getVillages(districtId));
        }
    };

    const handleVillageChange = (e) => {
        setSelectedVillage(Number(e.target.value));
    };

    const handleSetDefault = () => {
        setIsDefault((prev) => !prev);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const fullname = document.getElementById("fullname").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();
        const province = selectedProvince;
        const district = selectedDistrict;
        const village = selectedVillage;
        const addressDefault = isDefault;
    
        if (loading) {
            toast.error("Dữ liệu đang được tải, vui lòng thử lại sau!");
            return;
        }
    
        if (!fullname || !phone || !selectedProvince || !selectedDistrict || !selectedVillage || !address) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }
    
        const phoneRegex = /^(?:\+84|0)[3-9]\d{8}$/;
        if (!phoneRegex.test(phone)) {
            toast.error("Số điện thoại không hợp lệ!");
            return;
        }
    
        const newAddress = {
            fullname,
            phone,
            address,
            province,
            district,
            village,
            addressCategory: addressType === "Nhà riêng" ? "HOUSE" : "COMPANY",
            addressDefault,
        };
    
        console.log("Address data:", newAddress);
        try{
            await dispatch(createAddress(newAddress)).unwrap();
            toast.success("Địa chỉ đã được thêm thành công!");
            navigate(-1);
        } catch (error) {
            toast.error(error.message);
        }
    };    
    

    return (
        <div>
            <Header />
            <div className="bg-slate-100 py-10">
                <div className="px-4 md:px-8 lg:px-48 container mx-auto">
                    <div className="flex flex-col items-center justify-start">
                        <div className="w-full bg-white rounded-lg shadow-xl py-5 px-10">
                            <div className="flex flex-col items-start justify-center">
                                <span onClick={handleGoBack} className="inline-block">
                                    <IoReturnDownBackSharp className="inline-block"/>
                                    <button className="inline-block ml-5">Quay lại</button>
                                </span>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <p className="my-2 text-2xl font-semibold">THÊM ĐỊA CHỈ NHẬN HÀNG</p>
                                <form className="w-full" onSubmit={handleSubmit}>
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="fullname" className="block font-medium text-gray-700 mb-2">
                                                Họ và tên <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <input
                                                id="fullname"
                                                type="text"
                                                placeholder="Họ và tên"
                                                className="p-2 border rounded w-full"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block font-medium text-gray-700 mb-2">
                                                Số điện thoại <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <input
                                                id="phone"
                                                type="text"
                                                placeholder="Số điện thoại"
                                                className="p-2 border rounded w-full"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="province" className="block font-medium text-gray-700 mb-2">
                                                Tỉnh/Thành phố <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <select
                                                id="province"
                                                onChange={handleProvinceChange}
                                                className="p-2 border rounded w-full"
                                                value={selectedProvince || ""}
                                            >
                                                <option value="" disabled>
                                                    Chọn Tỉnh/Thành phố
                                                </option>
                                                {provinces.map((province) => (
                                                    <option key={province.id} value={province.id}>
                                                        {province.full_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="district" className="block font-medium text-gray-700 mb-2">
                                                Quận/Huyện <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <select
                                                id="district"
                                                onChange={handleDistrictChange}
                                                className="p-2 border rounded w-full"
                                                value={selectedDistrict || ""}
                                                disabled={!selectedProvince}
                                            >
                                                <option value="" disabled>Chọn Quận/Huyện</option>
                                                {districts.map((district) => (
                                                    <option key={district.id} value={district.id}>
                                                        {district.full_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="village" className="block font-medium text-gray-700 mb-2">
                                                Phường/Xã <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <select
                                                id="village"
                                                onChange={handleVillageChange}
                                                className="p-2 border rounded w-full"
                                                value={selectedVillage || ""}
                                                disabled={!selectedDistrict}
                                            >
                                                <option value="" disabled>Chọn Phường/Xã</option>
                                                {villages.map((village) => (
                                                    <option key={village.id} value={village.id}>
                                                        {village.full_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="address" className="block font-medium text-gray-700 mb-2">
                                                Địa chỉ <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <input
                                                id="address"
                                                type="text"
                                                placeholder="Địa chỉ"
                                                className="p-2 border rounded w-full"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-medium text-gray-700 mb-2">
                                                Loại địa chỉ <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`px-2 py-1 border rounded-md cursor-pointer ${
                                                        addressType === "Nhà riêng" ? "bg-blue-100 text-blue-500 " : "bg-gray-100"
                                                    }`}
                                                    onClick={() => setAddressType("Nhà riêng")}
                                                >
                                                    Nhà riêng
                                                </div>
                                                <div
                                                    className={`px-2 py-1 border rounded-md cursor-pointer ${
                                                        addressType === "Văn phòng" ? "bg-blue-100 text-blue-500 " : "bg-gray-100"
                                                    }`}
                                                    onClick={() => setAddressType("Văn phòng")}
                                                >
                                                    Văn phòng
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center mt-10">
                                            <div
                                                className={`relative inline-flex items-center h-6 w-12 cursor-pointer rounded-full 
                                                    ${isDefault ? 'bg-amber-400' : 'bg-gray-300'}`}
                                                onClick={handleSetDefault}
                                            >
                                                <span
                                                    className={`absolute left-0.5 h-5 w-5 transform rounded-full bg-white shadow transition-all 
                                                        ${isDefault ? 'translate-x-6' : ''}`}
                                                ></span>
                                            </div>
                                            <p className="ml-2 font-medium text-gray-700">
                                                {isDefault ? "Địa chỉ mặc định" : "Đặt làm mặc định"}
                                            </p>
                                        </div>

                                    </div>
                                    <div className="flex justify-end w-full mt-5">
                                        <button
                                            type="submit"
                                            className="bg-green-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-600"
                                        >
                                            Thêm
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default AddAddress;

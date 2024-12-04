import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProvinces, getDistricts, getVillages } from '../../../store/Reducers/locationReducer';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { IoReturnDownBackSharp } from "react-icons/io5";
import { toast } from 'react-toastify';
import { deleteAddress, updateAddress } from '../../../store/Reducers/addressReducer';

const AddAddress = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const addr = location.state;

    const { provinces, districts, villages, loading } = useSelector((state) => state.location);

    const [fullname, setFullname] = useState(addr.fullname);
    const [phone, setPhone] = useState(addr.phone);
    const [address, setAddress] = useState(addr.address);
    const [selectedProvince, setSelectedProvince] = useState(addr.province);
    const [selectedDistrict, setSelectedDistrict] = useState(addr.district);
    const [selectedVillage, setSelectedVillage] = useState(addr.village);
    const [addressType, setAddressType] = useState(addr.addressCategory);
    const [isDefault, setIsDefault] = useState(addr.addressDefault);

    const [AddressToDelete, setAddressToDelete] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(getProvinces());
        if (selectedProvince) {
            dispatch(getDistricts(selectedProvince));
        }
        if (selectedDistrict) {
            dispatch(getVillages(selectedDistrict));
        }
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
        
        const id = addr.id;
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
    
        const update = {
            id,
            fullname,
            phone,
            address,
            province,
            district,
            village,
            addressCategory: addressType === "Nhà riêng" ? "HOUSE" : "COMPANY",
            addressDefault,
        };

        try{
            await dispatch(updateAddress(update)).unwrap();
            toast.success("Cập nhật địa chỉ thành công!");
            navigate("/address");
        } catch (error) {
            toast.error(error.message);
        }
    };    

    const handleDeleteClick = (id) => {
        setAddressToDelete(id);
        setIsDeleteDialogOpen(true);
    };
    
    const handleConfirmDelete = async () => {
        if (AddressToDelete) {
            try {
                await dispatch(deleteAddress(AddressToDelete));
                toast.success('Xóa địa chỉ thành công');
                setAddressToDelete(null);
                setIsDeleteDialogOpen(false);
                navigate("/address");
              } catch (error) {
                toast.error(error.message);
            }
        }
    };
    
    const handleCancelDelete = () => {
        setAddressToDelete(null);
        setIsDeleteDialogOpen(false);
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
                                <p className="my-2 text-2xl font-semibold">CHỈNH SỬA ĐỊA CHỈ NHẬN HÀNG</p>
                                <form className="w-full" onSubmit={handleSubmit}>
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="fullname" className="block font-medium text-gray-700 mb-2">
                                                Họ và tên <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <input
                                                id="fullname"
                                                type="text"
                                                value={fullname}
                                                onChange={(e) => setFullname(e.target.value)}
                                                placeholder="Họ và tên"
                                                className="p-2 border rounded w-full"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block font-medium text-gray-700 mb-2">
                                                Số điện thoại <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <div className='flex items-center border border-gray-300 rounded-md px-3 py-2 w-full'>
                                                <span className="text-gray-500 mr-1">(+84)</span>
                                                <input
                                                    id="phone"
                                                    type="text"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="flex-1 bg-transparent focus:outline-none text-gray-900 placeholder-gray-500 w-0"
                                                    placeholder="Số điện thoại"
                                                />
                                            </div>
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
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
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
                                                        addressType === "HOUSE" ? "bg-blue-100 text-blue-500" : "bg-gray-100"
                                                    }`}
                                                    onClick={() => setAddressType("HOUSE")}
                                                >
                                                    Nhà riêng
                                                </div>
                                                <div
                                                    className={`px-2 py-1 border rounded-md cursor-pointer ${
                                                        addressType === "COMPANY" ? "bg-blue-100 text-blue-500" : "bg-gray-100"
                                                    }`}
                                                    onClick={() => setAddressType("COMPANY")}
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
                                            type="button"
                                            className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600 mr-5"
                                            onClick={() => handleDeleteClick(addr.id)}
                                        >
                                            Xóa
                                        </button>

                                        <button
                                            type="submit"
                                            className="bg-sky-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-600"
                                        >
                                            Cập nhật
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {isDeleteDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg">
                        <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>
                        <p className="mb-6">Bạn có chắc chắn muốn xóa địa chỉ này không?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                                onClick={handleCancelDelete}
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                                onClick={handleConfirmDelete}
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
            <Footer/>
        </div>
    );
};

export default AddAddress;

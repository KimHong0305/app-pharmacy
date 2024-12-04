import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from '../components/Header';
import Footer from "../components/Footer";
import { getDistricts, getProvinces, getVillages } from '../store/Reducers/locationReducer';

const Order = () => {
    const dispatch = useDispatch();
    const { provinces, districts, villages, loading } = useSelector((state) => state.location);

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedVillage, setSelectedVillage] = useState(null);

    useEffect(() => {
        dispatch(getProvinces());
    }, [dispatch]);

    const handleProvinceChange = (e) => {
        const provinceId = Number(e.target.value);
        setSelectedProvince(provinceId);
        setSelectedDistrict(null);
        setSelectedVillage(null);

        dispatch(getDistricts(selectedProvince));
    };

    const handleDistrictChange = (e) => {
        const districtId = Number(e.target.value);
        setSelectedDistrict(districtId);
        setSelectedVillage(null);

        dispatch(getVillages(selectedDistrict));
    };

    const handleVillageChange = (e) => {
        setSelectedVillage(Number(e.target.value));
    };

    return (
        <div>
            <Header />
            <div className='px-4 md:px-8 lg:px-48'>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-5">
                    {/* Danh sách sản phẩm */}
                    <div className="md:col-span-3 p-4">
                        <h2 className="text-2xl font-bold mb-4">Mua hàng</h2>
                        {/* Product list */}
                        <div className="border-b py-4 flex items-center">
                            <img
                                className="w-16 h-16 rounded-md mr-4"
                                src="https://via.placeholder.com/150"
                                alt="Product"
                            />
                            <div className="flex-grow">
                                <p className="font-medium">Tên sản phẩm</p>
                                <p className="text-sm text-gray-500">Đơn vị x Số lượng</p>
                            </div>
                            <p className="font-medium">Giá cả</p>
                        </div>
                        <div className="border-b py-4 flex items-center">
                            <img
                                className="w-16 h-16 rounded-md mr-4"
                                src="https://via.placeholder.com/150"
                                alt="Product"
                            />
                            <div className="flex-grow">
                                <p className="font-medium">Tên sản phẩm</p>
                                <p className="text-sm text-gray-500">Đơn vị x Số lượng</p>
                            </div>
                            <p className="font-medium">Giá cả</p>
                        </div>

                        {/* Thông tin người nhận */}
                        <h2 className="text-lg font-bold mt-6 mb-4">Thông tin người nhận</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="fullName" className="block font-medium text-gray-700 mb-2">
                                    Họ và tên <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    id="fullName"
                                    type="text"
                                    placeholder="Họ và tên"
                                    className="p-2 border rounded w-full"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="phoneNumber" className="block font-medium text-gray-700 mb-2">
                                    Số điện thoại <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    id="phoneNumber"
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
                                        <option key={province.code} value={province.code}>
                                            {province.name}
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
                                        <option key={district.code} value={district.code}>
                                            {district.name}
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
                                        <option key={village.code} value={village.code}>
                                            {village.name}
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
                        </div>

                        {/* Phương thức thanh toán */}
                        <div className="mt-6">
                            <h2 className="text-lg font-bold mb-4">Phương thức thanh toán</h2>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="payment-cash"
                                    name="payment-method"
                                    value="cash"
                                    className="mr-2"
                                />
                                <label htmlFor="payment-cash" className="flex items-center p-2">
                                    <img
                                        className="w-[40px] h-[40px] rounded overflow-hidden"
                                        src="http://localhost:3000/images/COD.png"
                                        alt="Tiền mặt"
                                    />
                                    <p className="ml-4">Tiền mặt</p>
                                </label>
                            </div>

                            <div className="flex items-center mt-4">
                                <input
                                    type="radio"
                                    id="payment-momo"
                                    name="payment-method"
                                    value="momo"
                                    className="mr-2"
                                />
                                <label htmlFor="payment-momo" className="flex items-center p-2">
                                    <img
                                        className="w-[40px] h-[40px] rounded overflow-hidden"
                                        src="http://localhost:3000/images/MoMo.webp"
                                        alt="Momo"
                                    />
                                    <p className="ml-4">Momo</p>
                                </label>
                            </div>

                            <div className="flex items-center mt-4">
                                <input
                                    type="radio"
                                    id="payment-vnpay"
                                    name="payment-method"
                                    value="vnpay"
                                    className="mr-2"
                                />
                                <label htmlFor="payment-vnpay" className="flex items-center p-2">
                                    <img
                                        className="w-[40px] h-[40px] rounded overflow-hidden"
                                        src="http://localhost:3000/images/VNPay.jpg"
                                        alt="VNPay"
                                    />
                                    <p className="ml-4">VNPay</p>
                                </label>
                            </div>

                            <div className="flex items-center mt-4">
                                <input
                                    type="radio"
                                    id="payment-zalopay"
                                    name="payment-method"
                                    value="zalopay"
                                    className="mr-2"
                                />
                                <label htmlFor="payment-zalopay" className="flex items-center p-2">
                                    <img
                                        className="w-[40px] h-[40px] rounded overflow-hidden"
                                        src="http://localhost:3000/images/ZaloPay.png"
                                        alt="ZaloPay"
                                    />
                                    <p className="ml-4">ZaloPay</p>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Chi tiết thanh toán */}
                    <div className="fixed p-4 w-1/5 border rounded top-[200px] right-[100px]">
                        <h2 className="text-lg font-bold mb-4">Chi tiết thanh toán</h2>
                        <p className="flex justify-between">
                            <span>Tạm tính:</span>
                            <span>0 VND</span>
                        </p>
                        <p className="flex justify-between my-2">
                            <span>Phí vận chuyển:</span>
                            <span>0 VND</span>
                        </p>
                        <div className="border-t border-gray-300 my-2"></div>
                        <p className="flex justify-between font-bold">
                            <span>Tổng tiền:</span>
                            <span>2 sản phẩm</span>
                        </p>
                        <button
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-700"
                        >
                            Đặt hàng
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Order;
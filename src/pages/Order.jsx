import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from '../components/Header';
import Footer from "../components/Footer";
import { getDistricts, getProvinces, getVillages } from '../store/Reducers/locationReducer';
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { createOrderHomeGuest } from "../store/Reducers/order/orderGuestReducer";
import { createPaymentVNPay } from "../store/Reducers/payment/VNPayReducer";
import { createPaymentMoMo } from "../store/Reducers/payment/MoMoReducer";
import { createPaymentZaloPay } from "../store/Reducers/payment/ZaloPayReducer";

const Order = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const selectedProduct = location.state;
    const { provinces, districts, villages, loading } = useSelector((state) => state.location);

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedVillage, setSelectedVillage] = useState(null);
    const [addressType, setAddressType] = useState('Nhà riêng');
    const [paymentMethod, setPaymentMethod] = useState("CASH");

    useEffect(() => {
        dispatch(getProvinces());
    }, [dispatch]);

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleProvinceChange = async (e) => {
        const provinceId = Number(e.target.value);
        try {
            setSelectedProvince(provinceId);
            setSelectedDistrict(null);
            setSelectedVillage(null);
            if (provinceId) {
                await dispatch(getDistricts(provinceId)).unwrap();
            }
        } catch (error) {
            console.error('Failed to load districts:', error);
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

    const handleOrder = async(e) => {
        e.preventDefault();

        const fullname = document.getElementById("fullName").value.trim();
        const phone = document.getElementById("phoneNumber").value.trim();
        const address = document.getElementById("address").value.trim();

        const province = selectedProvince;
        const district = selectedDistrict;
        const village = selectedVillage;

        if (!fullname || !phone || !selectedProvince || !selectedDistrict || !selectedVillage || !address) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const order = {
            priceId: selectedProduct.price.id,
            fullname,
            phone,
            address,
            province,
            district,
            village,
            addressCategory: addressType === "Nhà riêng" ? "HOUSE" : "COMPANY",
            paymentMethod: paymentMethod,
        };
        console.log('don hang',order)
        try{
            const result = await dispatch(createOrderHomeGuest(order)).unwrap();
            toast.success("Đặt hàng thành công!");
            if (result.result.paymentMethod === "VNPAY") {
                try {
                    const data = await dispatch(createPaymentVNPay(result.result.id)).unwrap();
                    if (data.result) {
                        window.location.href = data.result;
                    } else {
                        toast.error("Không tạo được thanh toán VNPay.");
                    }
                } catch (error) {
                    console.error("Error creating VNPay payment:", error);
                    toast.error("Đã xảy ra lỗi khi tạo thanh toán VNPay.");
                }
            }
            else {
                if (result.result.paymentMethod === "MOMO") {
                    try {
                        const data = await dispatch(createPaymentMoMo(result.result.id)).unwrap();
                        if (data.result) {
                            window.location.href = data.result.payUrl;
                        } else {
                            toast.error("Không tạo được thanh toán Momo.");
                        }
                    } catch (error) {
                        console.error("Error creating Momo payment:", error);
                        toast.error("Đã xảy ra lỗi khi tạo thanh toán Momo.");
                    }
                }
                else{
                    if (result.result.paymentMethod === "ZALOPAY") {
                        try {
                            const data = await dispatch(createPaymentZaloPay(result.result.id)).unwrap();
                            if (data.result) {
                                window.location.href = data.result.orderurl;
                            } else {
                                toast.error("Không tạo được thanh toán Momo.");
                            }
                        } catch (error) {
                            console.error("Error creating Momo payment:", error);
                            toast.error("Đã xảy ra lỗi khi tạo thanh toán Momo.");
                        }
                    }
                    else{
                        toast.success(`Đặt hàng thành công !`);
                        navigate('/')
                    }
                }
            }
        } catch (error) {
            toast.error(error.message);
        }

    }

    return (
        <div>
            <Header />
            <div className='px-4 md:px-8 lg:px-48'>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-5">
                    {/* Danh sách sản phẩm */}
                    <div className="md:col-span-3 p-4">
                        <h2 className="text-2xl font-bold mb-4">Mua hàng</h2>
                        {/* Product list */}
                        <div className="border-b py-4 flex items-center justify-between">
                            <div className="flex">
                                <img
                                    className="w-16 h-16 rounded-md mr-4"
                                    src={selectedProduct.images[0]}
                                    alt="Product"
                                />
                                <div className="flex-grow max-w-[500px]">
                                    <p className="font-medium break-words">{selectedProduct.name}</p>
                                    <p className="text-sm text-gray-500">{selectedProduct.price.unit.name}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 px-2">x1</p>
                            <p className="font-medium">
                                {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedProduct.price.price)}
                            </p>
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

                        </div>
                        {/* Phương thức thanh toán */}
                        <div className="mt-6">
                            <h2 className="text-lg font-bold mb-4">Phương thức thanh toán</h2>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="payment-cash"
                                    name="payment-method"
                                    value="CASH"
                                    className="mr-2"
                                    onChange={handlePaymentMethodChange}
                                    checked={paymentMethod === "CASH"}
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
                                    value="MOMO"
                                    className="mr-2"
                                    onChange={handlePaymentMethodChange}
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
                                    value="VNPAY"
                                    className="mr-2"
                                    onChange={handlePaymentMethodChange}
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
                                    value="ZALOPAY"
                                    className="mr-2"
                                    onChange={handlePaymentMethodChange}
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
                        <h2 className=" font-bold mb-4">Chi tiết thanh toán</h2>
                        <p className="flex justify-between">
                            <span>Tạm tính:</span>
                            <span>
                                {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedProduct.price.price)}
                            </span>
                        </p>
                        <p className="flex justify-between my-2">
                            <span>Phí vận chuyển:</span>
                            <span>0 đ</span>
                        </p>
                        <div className="border-t border-gray-300 my-2"></div>
                        <p className="flex justify-between items-center font-bold">
                            <div className="flex flex-col">
                                <span>Tổng tiền:</span>
                                <span className="font-normal text-sm text-gray-500">1 sản phẩm</span>
                            </div>
                            <span>
                                {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedProduct.price.price)}
                            </span>
                        </p>
                        <button
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-700"
                            onClick={handleOrder}
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
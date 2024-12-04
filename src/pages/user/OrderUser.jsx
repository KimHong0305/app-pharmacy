import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from '../../components/Header';
import Footer from "../../components/Footer";
import { fetchAddressWithLocationNames, getAddress } from "../../store/Reducers/addressReducer";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";

const OrderUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const selectedProduct = location.state;
    const [defaultAddress, setDefaultAddress] = useState(null);
    const [showAddressList, setShowAddressList] = useState(false);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const { address } = useSelector((state) => state.address);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await dispatch(getAddress());
                await dispatch(fetchAddressWithLocationNames());
            } catch (error) {
                console.error("Error fetching address:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dispatch]);

    useEffect(() => {
        const defaultAddr = address.find((addr) => addr.addressDefault);
        if (defaultAddr) {
            setDefaultAddress(defaultAddr);
        }
    }, [address]);

    const handleAddressClick = (addr) => {
        setDefaultAddress(addr);
        setShowAddressList(false);
    };

    const handleAddAddress = () => {
        navigate('/addAddress');
    }

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };
    

    const handleOrder = () => {
        const order = {
            priceId: selectedProduct.price.id,
            addressId: defaultAddress.id,
            paymentMethod: paymentMethod
        };
        console.log(order)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="px-4 md:px-8 lg:px-48">
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


                        <h2 className="text-lg font-bold mt-6">Thông tin người nhận</h2>
                        <div className="p-2 border-b border-gray-300 text-sm space-y-2">
                            {defaultAddress && (
                                <>
                                    <div className='flex justify-between'>
                                        <div className='flex'>
                                            <p className='font-semibold text-black'>
                                                {defaultAddress.fullname}
                                            </p>
                                            <div className="ml-2 mr-2 border-r border-gray-300"></div>
                                            <p>
                                                (+84) {defaultAddress.phone}
                                            </p>
                                        </div>
                                        <p className="w-[90px] px-2 text-center rounded border border-blue-700 text-blue-700">
                                            {defaultAddress.addressCategory === "HOUSE" ? "Nhà riêng" : 
                                            defaultAddress.addressCategory === "COMPANY" ? "Văn phòng" : "Loại khác"}
                                        </p>
                                    </div>
                                    <p>
                                        {defaultAddress.address}
                                    </p>
                                    <p>
                                        {defaultAddress.villageName}
                                    </p>
                                    {defaultAddress.addressDefault && (
                                        <p className='w-[80px] px-2 text-center rounded border border-red-600 text-red-600'>
                                            Mặc định
                                        </p>
                                    )}
                                </>
                            )}
                            <button
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                                onClick={() => setShowAddressList((prev) => !prev)}
                            >
                                {showAddressList ? "Đóng danh sách địa chỉ" : "Chọn địa chỉ khác"}
                            </button>
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

                        {showAddressList && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white p-6 rounded-md shadow-lg w-[600px]">
                                <h3 className="text-lg font-bold mb-4">Chọn địa chỉ</h3>
                                <div className="max-h-80 overflow-y-auto">
                                {address.map((addr) => (
                                    <div key={addr.id} className="p-4 border-b border-gray-300 text-sm text-gray-400 space-y-2"
                                    onClick={() => handleAddressClick(addr)}>
                                        <div className='flex justify-between'>
                                            <div className='flex'>
                                                <p className='font-semibold text-black'>
                                                    {addr.fullname}
                                                </p>
                                                <div className="ml-2 mr-2 border-r border-gray-300"></div>
                                                <p>
                                                    (+84) {addr.phone}
                                                </p>
                                            </div>
                                            <p className="w-[90px] px-2 text-center rounded border border-blue-700 text-blue-700">
                                                {addr.addressCategory === "HOUSE" ? "Nhà riêng" : 
                                                addr.addressCategory === "COMPANY" ? "Văn phòng" : "Loại khác"}
                                            </p>
                                        </div>
                                        <p>
                                            {addr.address}
                                        </p>
                                        <p>
                                            {addr.villageName}
                                        </p>
                                        {addr.addressDefault && (
                                            <p className='w-[80px] px-2 text-center rounded border border-red-600 text-red-600'>
                                                Mặc định
                                            </p>
                                        )}
                                    </div>
                                ))}
                                    <button className="mt-5 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600" 
                                    onClick= {handleAddAddress}
                                    >
                                        <div className='flex items-center justify-center'>
                                            <IoIosAddCircleOutline className='mr-1'/>
                                            <p>Thêm địa chỉ mới</p>
                                        </div>
                                    </button>
                                </div>
                                <div className="flex justify-end space-x-4 mt-4">
                                    <button
                                        className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                                        onClick={() => setShowAddressList(false)}
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                        )}

                    </div>

                    {/* Chi tiết thanh toán */}
                    <div className="fixed p-4 w-1/5 border rounded top-[200px] right-[100px]">
                        <h2 className="text-lg font-bold mb-4">Chi tiết thanh toán</h2>
                        <p className="flex justify-between">
                            <span>Tạm tính:</span>
                            <span>
                                {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedProduct.price.price)}
                            </span>
                        </p>
                        <p className="flex justify-between my-2">
                            <span>Phí vận chuyển:</span>
                            <span>0 VND</span>
                        </p>
                        <div className="border-t border-gray-300 my-2"></div>
                        <p className="flex justify-between items-center font-bold">
                            <div className="flex flex-col">
                                <span>Tổng tiền:</span>
                                <span className="font-normal text-gray-500">1 sản phẩm</span>
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

export default OrderUser;

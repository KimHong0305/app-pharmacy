import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoReturnDownBackSharp } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAddressDetail } from '../store/Reducers/addressReducer';
import { FaTruck } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";

const convertTimestampToDate = (timestamp) => {
    if (!timestamp) return "Không có dữ liệu";
    
    const date = new Date(timestamp * 1000);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

const DetailOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const order = location.state;
    const { addressDetail } = useSelector((state) => state.address);
    const [showPriceDetail, setShowPriceDetail] = useState(false);
    const handleGoBack = () => {
        navigate(-1);
    };
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getAddressDetail({
                    provinceId: order?.address?.province,
                    districtId: order?.address?.district,
                    wardCode: order?.address?.village
                }));
            } catch (error) {
                console.error("Error fetching address with location names:", error);
            }
        };
        fetchData();
    }, [dispatch, order?.address]);    

    if (!order) {
        return <div>Không có thông tin đơn hàng để hiển thị.</div>;
    }

    const { 
        id,
        orderDate, 
        orderItemResponses, 
        address,
        paymentMethod, 
        status, 
        totalPrice,
        newTotalPrice,
        deliveryTotal,
        coupon,
        isConfirm,
        leadTime
    } = order;

    return (
        <div className='bg-gray-50'>
            <Header/>
        <div className="px-4 md:px-8 lg:px-48 container mx-auto my-10">
            <div className="p-4 rounded bg-white shadow-lg">
                <div className="min-h-96">
                    <span onClick={handleGoBack} className="inline-block cursor-pointer">
                        <IoReturnDownBackSharp className="inline-block" />
                        <button className="inline-block ml-5">Quay lại</button>
                    </span>
                    <div className="py-5">
                        <h2 className="text-center text-2xl font-bold mb-5">Thông tin đơn hàng</h2>
                        <div className="w-full py-5 px-10">
                            <div>
                                <div className="p-3 mb-5 bg-blue-100 rounded-t-lg">
                                {address ? (
                                    <p className="text-blue-800 font-semibold flex items-center">
                                    <FaTruck className="mr-2" />
                                    Ngày giao hàng dự kiến: {convertTimestampToDate(leadTime)}
                                    </p>
                                ) : (
                                    <p className="text-blue-800 font-semibold flex items-center">
                                    <FaTruck className="mr-2" />
                                    Mua tại cửa hàng
                                    </p>
                                )}
                                </div>
                                <div className="flex justify-between pb-2 border-b border-gray-200 items-start">
                                    <div>
                                        <p className="text-lg mb-2 font-semibold">Mã đơn hàng: {id}</p>
                                        <p className="text-sm mb-2 text-gray-600">Ngày đặt: {orderDate}</p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 text-sm rounded-lg ${
                                            isConfirm === false ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'
                                        }`}
                                    >
                                        {isConfirm === false ? 'Đang xử lý' : 'Đang giao hàng'}
                                    </span>
                                </div>

                                {address && (
                                <div className="mt-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold mt-2">Thông tin người nhận</h2>
                                    <div className="py-2 text-sm space-y-2">
                                    <div className='flex justify-between'>
                                        <div className='flex'>
                                        <p className='font-semibold text-black'>
                                            {address?.fullname}
                                        </p>
                                        <div className="ml-2 mr-2 border-r border-gray-300"></div>
                                        <p>
                                            (+84) {address?.phone}
                                        </p>
                                        </div>
                                        <p className="w-[90px] px-2 text-center rounded border border-blue-700 text-blue-700">
                                        {address?.addressCategory === "HOUSE" ? "Nhà riêng" : 
                                        address?.addressCategory === "COMPANY" ? "Văn phòng" : "Loại khác"}
                                        </p>
                                    </div>
                                    <p>
                                        {address?.address}
                                    </p>
                                    <p>
                                        {addressDetail?.ward.WardName + ", " + addressDetail?.district.DistrictName + ", "+ addressDetail?.province.ProvinceName}
                                    </p>
                                    </div>
                                </div>
                                )}

                                <div className="mt-4 border-b border-gray-200">
                                {orderItemResponses.length > 0 ? (
                                    orderItemResponses.map((item, index) => (
                                        <div className="flex py-2 border-b border-gray-200" key={index}>
                                            <div className="w-1/6">
                                                <img
                                                    src={item.image}
                                                    alt={item.productName}
                                                    className="w-full h-auto object-cover"
                                                />
                                            </div>
                                            <div className="w-5/6 px-4 flex flex-col justify-start">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <p className="font-medium">{item.productName}</p>
                                                        <p className="text-sm text-gray-600">
                                                            Số lượng: {item.quantity} {item.unitName}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        Giá: {item.price.toLocaleString()} VND
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">Không có sản phẩm nào trong đơn hàng.</p>
                                )}
                                </div>


                                <div className="mt-4 flex justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            Phương thức thanh toán: <span className="font-semibold">{paymentMethod}</span>
                                        </p>

                                        {/* Hiển thị trạng thái thanh toán */}
                                        {paymentMethod !== 'CASH' && (
                                            <div className="mt-2">
                                                <span
                                                    className={`px-3 py-1 text-sm rounded-lg ${
                                                        status === 'PENDING' ? 'bg-yellow-200 text-yellow-800' :
                                                        status === 'SUCCESS' ? 'bg-green-200 text-green-800' :
                                                        status === 'FAILED' ? 'bg-red-200 text-red-800' :
                                                        status === 'CANCELLED' ? 'bg-gray-200 text-gray-800' : ''
                                                    }`}
                                                >
                                                    {status === 'PENDING' && 'Chờ xử lý'}
                                                    {status === 'SUCCESS' && 'Đã thanh toán'}
                                                    {status === 'FAILED' && 'Thanh toán thất bại'}
                                                    {status === 'CANCELLED' && 'Đã hủy'}
                                                </span>
                                            </div>
                                            )}
                                    </div>

                                    <div>
                                        <p className="text-lg font-semibold">
                                            Tổng tiền: {newTotalPrice.toLocaleString()} VND
                                        </p>
                                        <div 
                                            className="flex justify-end items-center cursor-pointer group"
                                            onClick={() => setShowPriceDetail(!showPriceDetail)}
                                        >
                                            <AiOutlineInfoCircle className="text-base text-blue-700 group-hover:text-blue-900 transition" />
                                            <p className="ml-1 text-sm text-blue-700 group-hover:text-blue-900 transition">
                                                {showPriceDetail ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {showPriceDetail && (
                                    <div className="mt-2 text-sm text-gray-800 space-y-1">
                                        <div className="flex justify-between">
                                            <span>Tổng tiền hàng:</span>
                                            <span>{totalPrice.toLocaleString()} VND</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Phí vận chuyển:</span>
                                            <span>{deliveryTotal.toLocaleString()} VND</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Giảm giá:</span>
                                            <span>-{coupon.toLocaleString() || 0} VND</span>
                                        </div>
                                        <hr className="my-1 border-gray-300" />
                                        <div className="flex justify-between font-semibold">
                                            <span>Tổng thanh toán:</span>
                                            <span>{newTotalPrice.toLocaleString()} VND</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
        </div>
    );
};

export default DetailOrder;

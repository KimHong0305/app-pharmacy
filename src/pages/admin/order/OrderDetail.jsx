import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoReturnDownBackSharp } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { getAddressDetail } from '../../../store/Reducers/addressReducer';
import ExportPdfComponent from '../../../components/ExportPdfComponent'

const OrderDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const order = location.state;
    const [showPdf, setShowPdf] = useState(false);

    const { addressDetail } = useSelector((state) => state.address);
    const [loading, setLoading] = useState(true);
    const handleGoBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await dispatch(getAddressDetail({
                    provinceId: order?.address?.province,
                    districtId: order?.address?.district,
                    wardCode: order?.address?.village
                }));
            } catch (error) {
                console.error("Error fetching address with location names:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [dispatch, order?.address]);    

    if (!order) {
        return <div>Không có thông tin đơn hàng để hiển thị.</div>;
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl">Đang tải dữ liệu...</p>
            </div>
        );
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
        leadTime,
        isReceived,
    } = order;

    return (
        <div className="px-2 md:px-4">
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
                                <div className="flex justify-between pb-2 border-b border-gray-200 items-center">
                                    <div>
                                        <p className="text-lg font-semibold">Mã đơn hàng: {id}</p>
                                        <p className="text-sm text-gray-600">Ngày đặt: {orderDate}</p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 text-sm rounded-lg ${
                                            isReceived === true
                                            ? 'bg-green-200 text-green-800'
                                            : isConfirm === false
                                            ? 'bg-yellow-200 text-yellow-800'
                                            : 'bg-blue-200 text-blue-800'
                                        }`}
                                        >
                                        {isReceived === true
                                            ? 'Đã nhận hàng'
                                            : isConfirm === false
                                            ? 'Đang xử lý'
                                            : 'Đang giao hàng'
                                        }
                                    </span>
                                </div>

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

                                    <p className="text-lg font-semibold">
                                        Tổng tiền: {newTotalPrice.toLocaleString()} VND
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mr-10">
                    <button
                        onClick={() => setShowPdf(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
                    >
                        Xuất PDF
                    </button>
                </div>
                {showPdf && (
                <ExportPdfComponent
                    order={order}
                    addressDetail={addressDetail}
                    onFinish={() => setShowPdf(false)}
                />
                )}
            </div>
        </div>
    );
};

export default OrderDetail;

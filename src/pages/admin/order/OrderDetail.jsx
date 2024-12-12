import React, { useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoReturnDownBackSharp } from "react-icons/io5";
import { fetchAddressWithLocationNames } from '../../../store/Reducers/addressReducer';
import { useDispatch, useSelector } from 'react-redux';

const OrderDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const order = location.state;

    const { updateAddress } = useSelector((state) => state.address);

    const handleGoBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        if (order?.address) {
            dispatch(fetchAddressWithLocationNames(order.address));
        }
    }, [dispatch, order?.address]);

    if (!order) {
        return <div>Không có thông tin đơn hàng để hiển thị.</div>;
    }

    const { 
        id,
        address, 
        orderDate, 
        orderItemResponses, 
        paymentMethod, 
        status, 
        totalPrice,
        isConfirm
    } = order;

    console.log('dia chi',updateAddress)

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
                                            isConfirm === false ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'
                                        }`}
                                    >
                                        {isConfirm === false ? 'Đang xử lý' : 'Đang giao hàng'}
                                    </span>
                                </div>

                                <div className="mt-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold mt-2">Thông tin người nhận</h2>
                                    <div className="py-2 text-sm space-y-2">
                                        <div className='flex justify-between'>
                                            <div className='flex'>
                                                <p className='font-semibold text-black'>
                                                    {updateAddress.fullname}
                                                </p>
                                                <div className="ml-2 mr-2 border-r border-gray-300"></div>
                                                <p>
                                                    (+84) {updateAddress.phone}
                                                </p>
                                            </div>
                                            <p className="w-[90px] px-2 text-center rounded border border-blue-700 text-blue-700">
                                                {updateAddress.addressCategory === "HOUSE" ? "Nhà riêng" : 
                                                updateAddress.addressCategory === "COMPANY" ? "Văn phòng" : "Loại khác"}
                                            </p>
                                        </div>
                                        <p>
                                            {updateAddress.address}
                                        </p>
                                        <p>
                                            {updateAddress.villageName}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 border-b border-gray-200">
                                {orderItemResponses.length > 0 && (
                                    <div className="flex py-2">
                                    <div className="w-1/6">
                                        <img
                                        src={orderItemResponses[0].image}
                                        alt={orderItemResponses[0].productName}
                                        className="w-full h-auto object-cover"
                                        />
                                    </div>
                                    <div className="w-5/6 px-4 flex flex-col justify-start">
                                        <div className="flex justify-between">
                                        <div>
                                            <p className="font-medium">{orderItemResponses[0].productName}</p>
                                            <p className="text-sm text-gray-600">
                                            Số lượng: {orderItemResponses[0].quantity} {orderItemResponses[0].unitName}
                                            </p>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Giá: {orderItemResponses[0].price.toLocaleString()} VND
                                        </p>
                                        </div>
                                    </div>
                                    </div>
                                )}
                                
                                {/* Hiển thị số lượng sản phẩm khác */}
                                {orderItemResponses.length > 1 && (
                                    <p className="my-2 text-sm text-gray-500">
                                        {orderItemResponses.length - 1} sản phẩm khác
                                    </p>
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
                                        Tổng tiền: {totalPrice.toLocaleString()} VND
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;

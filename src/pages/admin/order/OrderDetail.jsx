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
        address, 
        orderDate, 
        orderItemResponses, 
        paymentMethod, 
        status, 
        totalPrice 
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
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className="p-4 text-sm  border-r border-gray-300 text-gray-400 space-y-2">
                                <h3 className="text-lg font-semibold text-black">Thông tin người nhận</h3>
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
                            <div className="p-4 text-sm space-y-2">
                                <div className='flex justify-between'>
                                    <h3 className="text-lg font-semibold text-black">Thông tin đơn hàng</h3>
                                    <p>
                                        <span 
                                            className={`px-3 py-1 ml-2 font-semibold rounded ${
                                                status === 'PENDING' 
                                                    ? 'bg-yellow-200 text-yellow-600' 
                                                    : status === 'SUCCESS' 
                                                    ? 'bg-green-200 text-green-600' 
                                                    : 'bg-gray-500 text-white'
                                            }`}
                                        >
                                            {status}
                                        </span>
                                    </p>
                                </div>
                                <p><strong>Ngày đặt hàng:</strong> {orderDate}</p>
                                <p><strong>Phương thức thanh toán:</strong> {paymentMethod}</p>
                                <p><strong>Tổng giá trị:</strong> {new Intl.NumberFormat('vi-VN').format(totalPrice)} đ</p>
                            </div>
                        </div>
                        <div className='p-4'>
                            <h3 className="text-lg font-semibold">Danh sách sản phẩm:</h3>
                            <table className="w-full table-auto border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 px-2 py-1">STT</th>
                                        <th className="border border-gray-300 px-2 py-1">Tên sản phẩm</th>
                                        <th className="border border-gray-300 px-2 py-1">Đơn vị</th>
                                        <th className="border border-gray-300 px-2 py-1">Số lượng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderItemResponses.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-100">
                                            <td className="border border-gray-300 px-2 py-1 text-center">{index + 1}</td>
                                            <td className="border border-gray-300 px-2 py-1">{item.productName}</td>
                                            <td className="border border-gray-300 px-2 py-1">{item.unitName}</td>
                                            <td className="border border-gray-300 px-2 py-1 text-center">{item.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;

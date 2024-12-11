import React, { useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { TbCoinYuanFilled } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../store/Reducers/authReducer';
import { HiOutlineUserCircle } from "react-icons/hi2";
import { IoLocationOutline } from "react-icons/io5";
import { PiNewspaperClippingLight } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import { getHistory } from '../../store/Reducers/order/orderUserReducer';

const HistoryOrder = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { bio } = useSelector((state) => state.auth);   
    const { history } = useSelector((state) => state.orderUser);

    useEffect(() => {
        dispatch(getUserInfo());
        dispatch(getHistory());
    }, [dispatch]);
    
    const handleAddress = () => {
        navigate('/address');
    }

    const handleProfile = () => {
        navigate('/profile');
    };

    if (!bio) {
        return <div>No user information available.</div>;
    }

    const { username, point } = bio;

    console.log(history);

    return (
        <div>
            <Header />
            <div className="bg-slate-100 py-10">
                <div className="px-4 md:px-8 lg:px-48 container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className='md:col-span-1 space-y-8'>
                            <div className='w-full bg-white rounded-lg shadow-xl flex flex-col p-5'>
                                <div className='flex items-center justify-start'>
                                    <img className='w-[80px] h-[80px] rounded-full border-2 overflow-hidden' src={bio.image || "https://via.placeholder.com/80"} alt="" />
                                    <div className='ml-4 flex flex-col items-start'>
                                        <p className='text-lg font-normal'>{username}</p>
                                        <div className='flex items-center justify-center mt-5 '>
                                            <p className='text-lg font-normal mr-2'>Số xu: {point}</p>
                                            <TbCoinYuanFilled className='h-5 w-5 text-orange-500'/>
                                        </div>
                                    </div>
                                </div>
                                <div className="my-4 flex-grow border-t border-gray-300"></div>
                                <div className="flex flex-col items-start justify-start space-y-4">
                                    <button className="block w-full h-10 flex items-center space-x-2 text-left text-gray-700 font-medium hover:text-sky-600" onClick={handleProfile}>
                                        <HiOutlineUserCircle className="text-xl ml-2"/>
                                        <span>Thông tin cá nhân</span>
                                    </button>
                                    <button className="block w-full h-10 flex items-center space-x-2 text-left text-gray-700 font-medium hover:text-sky-600" onClick={handleAddress}>
                                        <IoLocationOutline className="text-xl ml-2"/>
                                        <span>Địa chỉ nhận hàng</span>
                                    </button>
                                    <button className="block w-full h-10 flex items-center space-x-2 text-left text-sky-600 bg-sky-100 font-medium">
                                        <PiNewspaperClippingLight className="text-xl ml-2"/>
                                        <span>Lịch sử mua hàng</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='md:col-span-2 flex flex-col items-center justify-start'>
                            <div className='w-full bg-white rounded-lg shadow-xl flex flex-col items-center justify-center py-5 px-10 divide-y'>
                                <p className='mb-4 text-2xl font-semibold'>LỊCH SỬ MUA HÀNG</p>
                                {history.length === 0 ? (
                                    <div className="text-center py-10">
                                        <p>Bạn chưa có đơn hàng nào.</p>
                                    </div>
                                ) : (
                                    history.map((order) => (
                                        <div key={order.id} className="w-full py-4 border-b">
                                            <div className="w-full py-5">
                                                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                                                    <div className="flex justify-between pb-2 border-b border-gray-200 items-center">
                                                        <div>
                                                            <p className="text-lg font-semibold">Mã đơn hàng: {order.id}</p>
                                                            <p className="text-sm text-gray-600">Ngày đặt: {order.orderDate}</p>
                                                        </div>
                                                        <span
                                                            className={`px-3 py-1 text-sm rounded-lg ${
                                                                order.isConfirm === false ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'
                                                            }`}
                                                        >
                                                            {order.isConfirm === false ? 'Đang xử lý' : 'Đang giao hàng'}
                                                        </span>
                                                    </div>

                                                    <div className="mt-4 border-b border-gray-200">
                                                    {order.orderItemResponses.length > 0 && (
                                                        <div className="flex py-2">
                                                        <div className="w-1/6">
                                                            <img
                                                            src={order.orderItemResponses[0].image}
                                                            alt={order.orderItemResponses[0].productName}
                                                            className="w-full h-auto object-cover"
                                                            />
                                                        </div>
                                                        <div className="w-5/6 flex flex-col justify-start">
                                                            <div className="flex justify-between">
                                                            <div>
                                                                <p className="font-medium">{order.orderItemResponses[0].productName}</p>
                                                                <p className="text-sm text-gray-600">
                                                                Số lượng: {order.orderItemResponses[0].quantity} {order.orderItemResponses[0].unitName}
                                                                </p>
                                                            </div>
                                                            <p className="text-sm text-gray-600 ml-5">
                                                                Giá: {order.orderItemResponses[0].price.toLocaleString()} VND
                                                            </p>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Hiển thị số lượng sản phẩm khác */}
                                                    {order.orderItemResponses.length > 1 && (
                                                        <p className="my-2 text-sm text-gray-500">
                                                        {order.orderItemResponses.length - 1} sản phẩm khác
                                                        </p>
                                                    )}
                                                    </div>


                                                    <div className="mt-4 flex justify-between">
                                                        <div>
                                                            <p className="text-sm text-gray-600">
                                                                Phương thức thanh toán: <span className="font-semibold">{order.paymentMethod}</span>
                                                            </p>

                                                            {/* Hiển thị trạng thái thanh toán */}
                                                            <div className="mt-2">
                                                                <span
                                                                    className={`px-3 py-1 text-sm rounded-lg ${
                                                                        order.status === 'PENDING' ? 'bg-yellow-200 text-yellow-800' :
                                                                        order.status === 'SUCCESS' ? 'bg-green-200 text-green-800' :
                                                                        order.status === 'FAILED' ? 'bg-red-200 text-red-800' :
                                                                        order.status === 'CANCELLED' ? 'bg-gray-200 text-gray-800' : ''
                                                                    }`}
                                                                >
                                                                    {order.status === 'PENDING' && 'Chờ xử lý'}
                                                                    {order.status === 'SUCCESS' && 'Đã thanh toán'}
                                                                    {order.status === 'FAILED' && 'Thanh toán thất bại'}
                                                                    {order.status === 'CANCELLED' && 'Đã hủy'}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <p className="text-lg font-semibold">
                                                            Tổng tiền: {order.totalPrice.toLocaleString()} VND
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HistoryOrder;

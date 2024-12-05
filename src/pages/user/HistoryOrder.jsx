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
                                            <p className="text-lg font-bold">Mã đơn hàng: {order.id}</p>
                                            <p>Ngày đặt: {order.orderDate}</p>
                                            <p>Tổng tiền: {order.totalPrice.toLocaleString()}đ</p>
                                            <p>Phương thức thanh toán: {order.paymentMethod}</p>
                                            <p>Trạng thái: {order.status}</p>
                                            <div>
                                                <p className="mt-2 font-semibold">Sản phẩm:</p>
                                                {order.orderItemResponses.map((item, index) => (
                                                    <div key={index} className="pl-4">
                                                        <p>{item.productName} ({item.unitName}) x {item.quantity}</p>
                                                        <p>Giá: {item.price.toLocaleString()}đ</p>
                                                    </div>
                                                ))}
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

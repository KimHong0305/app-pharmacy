import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { getOrder } from '../store/Reducers/order/orderGuestReducer';
import { useNavigate } from 'react-router-dom';

const SearchOrder = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [result, setResult] = useState(null);

    const handleSearch = async () => {
        if (searchQuery.trim() === '') {
            toast.error('Vui lòng nhập mã đơn hàng!');
            return;
        }

        try {
            const order = await dispatch(getOrder(searchQuery)).unwrap();
            setResult(order.result);
            setSearchQuery('');
        } catch (error) {
            toast.error(error.message || 'Không tìm thấy đơn hàng.');
            setResult('');
            setSearchQuery('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleOrderDetail= (order) => {
        navigate('/orderDetail', { state: order });
    };

    return (
        <div>
            <Header />
            <div className="bg-slate-100 py-10">
                <div className="px-4 md:px-8 lg:px-48 container mx-auto">
                    <div className="bg-gray-50  rounded-lg shadow-xl min-h-[400px] p-6">
                        <div className="w-full flex flex-col items-center justify-center">
                            <p className="mt-5 text-2xl font-semibold">TRA CỨU ĐƠN HÀNG</p>
                            <div className="my-5 flex items-center border border-gray-300 rounded-lg overflow-hidden w-1/2 bg-white">
                                <input
                                    type="text"
                                    placeholder="Nhập mã đơn hàng..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    className="flex-1 p-2 focus:outline-none"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="p-2"
                                >
                                    <FaSearch />
                                </button>
                            </div>
                            

                            {/* Hiển thị kết quả */}
                            {result && (
                                <div className="w-full py-5 px-10 cursor-pointer" onClick={() => handleOrderDetail(result)}>
                                    <div className="p-4 bg-white border border-gray-200 rounded-lg">
                                        <div className="flex justify-between pb-2 border-b border-gray-200 items-center">
                                            <div>
                                                <p className="text-lg font-semibold">Mã đơn hàng: {result.id}</p>
                                                <p className="text-sm text-gray-600">Ngày đặt: {result.orderDate}</p>
                                            </div>
                                            <span
                                                className={`px-3 py-1 text-sm rounded-lg ${
                                                    result.isConfirm === false ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'
                                                }`}
                                            >
                                                {result.isConfirm === false ? 'Đang xử lý' : 'Đang giao hàng'}
                                            </span>
                                        </div>

                                        <div className="mt-4 border-b border-gray-200">
                                        {result.orderItemResponses.length > 0 && (
                                            <div className="flex py-2">
                                            <div className="w-1/6">
                                                <img
                                                src={result.orderItemResponses[0].image}
                                                alt={result.orderItemResponses[0].productName}
                                                className="w-full h-auto object-cover"
                                                />
                                            </div>
                                            <div className="w-5/6 px-4 flex flex-col justify-start">
                                                <div className="flex justify-between">
                                                <div>
                                                    <p className="font-medium">{result.orderItemResponses[0].productName}</p>
                                                    <p className="text-sm text-gray-600">
                                                    Số lượng: {result.orderItemResponses[0].quantity} {result.orderItemResponses[0].unitName}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    Giá: {result.orderItemResponses[0].price.toLocaleString()} VND
                                                </p>
                                                </div>
                                            </div>
                                            </div>
                                        )}
                                        
                                        {/* Hiển thị số lượng sản phẩm khác */}
                                        {result.orderItemResponses.length > 1 && (
                                            <p className="my-2 text-sm text-gray-500">
                                             {result.orderItemResponses.length - 1} sản phẩm khác
                                            </p>
                                        )}
                                        </div>


                                        <div className="mt-4 flex justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600">
                                                    Phương thức thanh toán: <span className="font-semibold">{result.paymentMethod}</span>
                                                </p>

                                                {/* Hiển thị trạng thái thanh toán */}
                                                {result.paymentMethod !== 'CASH' && (
                                                    <div className="mt-2">
                                                        <span
                                                            className={`px-3 py-1 text-sm rounded-lg ${
                                                                result.status === 'PENDING' ? 'bg-yellow-200 text-yellow-800' :
                                                                result.status === 'SUCCESS' ? 'bg-green-200 text-green-800' :
                                                                result.status === 'FAILED' ? 'bg-red-200 text-red-800' :
                                                                result.status === 'CANCELLED' ? 'bg-gray-200 text-gray-800' : ''
                                                            }`}
                                                        >
                                                            {result.status === 'PENDING' && 'Chờ xử lý'}
                                                            {result.status === 'SUCCESS' && 'Đã thanh toán'}
                                                            {result.status === 'FAILED' && 'Thanh toán thất bại'}
                                                            {result.status === 'CANCELLED' && 'Đã hủy'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <p className="text-lg font-semibold">
                                                Tổng tiền: {result.totalPrice.toLocaleString()} VND
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <p className='text-right'>Cần trợ giúp ? Liên hệ: <span className="font-semibold">0888403055</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default SearchOrder;

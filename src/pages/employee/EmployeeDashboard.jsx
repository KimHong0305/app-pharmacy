import React, { useEffect } from 'react';
import { FaUsers } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6"; 
import { useDispatch, useSelector } from 'react-redux';
import { getTotalOrderNotConfirm, getTotalProduct } from '../../store/Reducers/dashboardReducer';
import { getOrderCOD, getOrders } from '../../store/Reducers/order/orderAdminReducer';
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate();
    const {totalProduct, totalOrderNotConfirm} = useSelector(state=> state.dashboard)
    const { bio } = useSelector((state) => state.user); 
    const { orders, orderCOD } = useSelector((state) => state.orderAdmin);

    const unconfirmedOrders = [...orders, ...orderCOD].filter(order => !order.isConfirm);

    useEffect(() => {
        dispatch(getTotalProduct());
        dispatch(getTotalOrderNotConfirm());
        dispatch(getOrderCOD(0, 1000));
        dispatch(getOrders(0, 1000));
    }, [dispatch])

    return (
        <div className='px-2 md:px-7 py-5'>


            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7'>


                <div className='flex shadow-md justify-between items-center p-5 bg-[#e9feea] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-3xl font-bold'>{totalProduct}</h2>
                        <span className='text-md font-medium'>Products</span>
                    </div>

                    <div className='w-[40px] h-[47px] rounded-full bg-[#038000] flex justify-center items-center text-xl'>
                    <FaUsers  className='text-[#fae8e8] shadow-lg' /> 
                    </div> 
                </div>


                <div className='flex shadow-md justify-between items-center p-5 bg-[#ecebff] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-3xl font-bold'>{totalOrderNotConfirm}</h2>
                        <span className='text-md font-medium'>Order Not Confirm</span>
                    </div>

                    <div className='w-[40px] h-[47px] rounded-full bg-[#0200f8] flex justify-center items-center text-xl'>
                    <FaCartShopping  className='text-[#fae8e8] shadow-lg' /> 
                    </div> 
                </div>
 
            </div>

        
        
        <div className='w-full flex flex-wrap mt-7'>
            <div className='w-full lg:pr-3'>
                {/* Thông tin nhân viên */}
                <div className='bg-white p-6 rounded-md shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                    {/* Avatar + Thông tin */}
                    <div className='flex items-center gap-6'>
                        <img
                            src={bio?.image || '/images/avata_1.png'}
                            alt="avatar"
                            className="w-32 h-32 rounded-full object-cover border"
                        />
                        <div className='text-base space-y-1'>
                            <p><strong>Họ tên:</strong> {bio?.lastname} {bio?.firstname}</p>
                            <p><strong>Chuyên môn:</strong> {bio?.specilization}</p>
                        </div>
                    </div>

                    {/* Trạng thái */}
                    <div className='text-base mt-4 md:mt-0'>
                        <span
                            className={`inline-block px-3 py-1 text-sm rounded font-semibold ${
                                bio?.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                        >
                            {bio?.status ? 'Đang làm việc' : 'Ngưng hoạt động'}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div className='mt-7 w-full'>
            <div className='bg-white p-6 rounded-md shadow-md'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-semibold mb-4'>Đơn hàng chưa xác nhận</h2>
                    <div className='flex items-center justify-center text-sm text-blue-600 space-x-1 cursor-pointer'
                    onClick={() => navigate('/employee/orders')}>
                        <p>Tới xem</p>
                        <IoIosArrowForward />
                    </div>
                </div>
                {unconfirmedOrders.length === 0 ? (
                <p className='text-gray-500'>Không có đơn hàng chưa xác nhận.</p>
                ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Mã đơn</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Khách hàng</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Ngày tạo</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Tổng tiền</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Phương thức</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {unconfirmedOrders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-900">{order.id}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                                {order?.address?.fullname || '---'}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                                {order.orderDate}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                                {order.newTotalPrice.toLocaleString()}₫
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">
                                {order.paymentMethod}
                            </td>
                            <td className="px-4 py-2">
                                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                                Chưa xác nhận
                                </span>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                )}
            </div>
        </div>


        </div>
    );
};

export default EmployeeDashboard;
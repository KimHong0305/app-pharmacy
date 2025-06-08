import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { getRoomVacant } from '../../store/Reducers/chat/chatNurseReducer';

const NurseDashboard = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { bio } = useSelector((state) => state.user); 
    const { rooms } = useSelector((state) => state.chat_nurse);

    useEffect(() => {
        dispatch(getRoomVacant());
    }, [dispatch]);

    return (
        <div className='px-2 md:px-7 py-5'>
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
                <div className='flex items-center justify-between mb-4'>
                    <h2 className='text-xl font-semibold'>Tin nhắn chờ</h2>
                    <div
                    className='flex items-center justify-center text-sm text-blue-600 space-x-1 cursor-pointer'
                    onClick={() => navigate('/nurse/chat')}
                    >
                    <p>Tới xem</p>
                    <IoIosArrowForward />
                    </div>
                </div>

                {rooms?.length > 0 ? (
                <ul className='space-y-4'>
                    {rooms.map((room) => (
                    <li
                        key={room.roomId}
                        className='flex items-start gap-4 border rounded-md p-4 hover:bg-gray-50 transition duration-200'
                    >
                        <img
                        src={room.senderImage || '/images/avata_1.png'}
                        alt="sender"
                        className="w-12 h-12 rounded-full object-cover border"
                        />
                        <div className='flex-1'>
                        <div className='flex justify-between items-center'>
                            <p className='font-medium text-base'>{room.senderName}</p>
                            <p className='text-xs text-gray-500'>
                                {new Date(room.lastTime).toLocaleString('vi-VN', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                        <p className='text-sm text-gray-700 line-clamp-2'>{room.lastMessage}</p>
                        </div>
                    </li>
                    ))}
                </ul>
                ) : (
                <p className='text-gray-500'>Không có tin nhắn nào đang chờ.</p>
                )}
            </div>
        </div>
        </div>
    );
};

export default NurseDashboard;
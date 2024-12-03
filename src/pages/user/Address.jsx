import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { TbCoinYuanFilled } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../store/Reducers/authReducer';
import { HiOutlineUserCircle } from "react-icons/hi2";
import { IoLocationOutline } from "react-icons/io5";
import { PiNewspaperClippingLight } from "react-icons/pi";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Profile = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getUserInfo());
    }, [dispatch]);

    const { bio } = useSelector((state) => state.auth);   

    const hanldeProfile = () => {
        navigate('/profile');
    }

    if (!bio) {
        return <div>No user information available.</div>;
    }

    const { username, image, point} = bio;

    return (
        <div>
            <Header />
            <div className="bg-slate-100 py-10">
            <div className="px-4 md:px-8 lg:px-48 container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className='md:col-span-1 space-y-8'>
                        <div className='w-full bg-white rounded-lg shadow-xl flex flex-col p-5'>
                            <div className='flex items-center justify-start'>
                                <img className='w-[80px] h-[80px] rounded-full border-2 overflow-hidden' src={image} alt="" />
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
                                <button className="block w-full h-10 flex items-center space-x-2 text-left text-gray-700 font-medium hover:text-sky-600"
                                onClick={hanldeProfile}>
                                    <HiOutlineUserCircle className="text-xl ml-2"/>
                                    <span>Thông tin cá nhân</span>
                                </button>
                                
                                <button className="block w-full h-10 flex items-center space-x-2 text-left text-sky-600 bg-sky-100 font-medium">
                                    <IoLocationOutline className="text-xl ml-2"/>
                                    <span>Địa chỉ nhận hàng</span>
                                </button>

                                <button className="block w-full h-10 flex items-center space-x-2 text-left text-gray-700 font-medium hover:text-sky-600">
                                    <PiNewspaperClippingLight className="text-xl ml-2"/>
                                    <span>Lịch sử mua hàng</span>
                                </button>
                            </div>

                        </div>
                    </div>
                    <div className='md:col-span-2 flex flex-col items-center justify-start'>
                        <div className='w-full bg-white rounded-lg shadow-xl flex flex-col items-center justify-center py-5 px-10 divide-y'>
                        <p className='mb-4 text-2xl font-semibold'>ĐỊA CHỈ NHẬN HÀNG</p>
                        
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
import React, { useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { TbCoinYuanFilled } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../store/Reducers/authReducer';

const Profile = () => {

    const dispatch = useDispatch();
    const { bio } = useSelector((state) => state.auth);   

    useEffect(() => {
        const token = localStorage.getItem('token');
    
        if (token) {
          dispatch(getUserInfo(token));
          console.log(bio)
        }
      }, [dispatch]);

    if (!bio) {
    return <div>No user information available.</div>;
    }

    const { username, dob, email, point, status, isVerified } = bio;

    console.log(username)

    return (
        <div>
            <Header />
            <div className="bg-slate-100 py-10">
            <div className="px-4 md:px-8 lg:px-48 container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className='md:col-span-1 flex flex-col items-center justify-start space-y-8'>
                        <div className='w-full bg-white rounded-lg shadow-xl flex flex-col items-center justify-center py-5'>
                            <img className='w-[100px] h-[100px] rounded-full overflow-hidden' src="http://localhost:3000/images/avata_1.jpg" alt="" />
                            <p className='mt-2 text-lg font-normal'>{username}</p>
                            <div className='flex items-center justify-center mt-5 '>
                                <p className='text-lg font-normal mr-2'>Số xu: {point}</p>
                                <TbCoinYuanFilled className='h-5 w-5 text-orange-500'/>
                            </div>
                            <button className="h-10 px-6 my-5 rounded-lg bg-sky-500 hover:bg-sky-700 font-semibold">
                                Lịch sử mua hàng
                            </button>
                        </div>
                    </div>
                    <div className='md:col-span-2 flex flex-col items-center justify-start'>
                        <p className='mb-2 text-xl font-semibold'>THÔNG TIN CÁ NHÂN</p>
                        <div className='w-full bg-white rounded-lg shadow-xl flex flex-col items-start justify-center py-5 pl-10 divide-y'>
                        <form className="w-full">
                            <div className="flex justify-between w-full py-2">
                            <label htmlFor="username" className="font-semibold">
                                Tên đăng nhập:
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                className="border-gray-300 rounded-md px-2 py-1 w-2/3"
                                readOnly
                            />
                            </div>
                            <div className="flex justify-between w-full py-2">
                            <label htmlFor="dob" className="font-semibold">
                                Ngày sinh:
                            </label>
                            <input
                                type="text"
                                id="dob"
                                name="dob"
                                value={dob}
                                className="border-gray-300 rounded-md px-2 py-1 w-2/3"
                                readOnly
                            />
                            </div>
                            <div className="flex justify-between w-full py-2">
                            <label htmlFor="email" className="font-semibold">
                                Email:
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                className="border-gray-300 rounded-md px-2 py-1 w-2/3"
                                readOnly
                            />
                            </div>
                            <div className="flex justify-between w-full py-2">
                            <label htmlFor="status" className="font-semibold">
                                Trạng thái:
                            </label>
                            <input
                                type="text"
                                id="status"
                                name="status"
                                value={status ? 'Active' : 'Inactive'}
                                className="border-gray-300 rounded-md px-2 py-1 w-2/3"
                                readOnly
                            />
                            </div>
                            <div className="flex justify-between w-full py-2">
                            <label htmlFor="isVerified" className="font-semibold">
                                Xác minh:
                            </label>
                            <input
                                type="text"
                                id="isVerified"
                                name="isVerified"
                                value={isVerified ? 'Yes' : 'No'}
                                className="border-gray-300 rounded-md px-2 py-1 w-2/3"
                                readOnly
                            />
                            </div>
                            <div className="flex justify-end w-full mt-5 pr-5">
                                <button className="h-10 px-3 rounded bg-sky-500 hover:bg-sky-700 text-white text-lg font-semibold" type="submit">
                                Cập nhật
                                </button>
                            </div>
                        </form>
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
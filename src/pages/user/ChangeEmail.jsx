import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoReturnDownBackSharp } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { toast } from 'react-toastify';
import { updateEmail } from '../../store/Reducers/userReducer';
import VerifyEmail from './VerifyEmail';

const ChangeEmail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showVerify, setShowVerify] = useState(false);

    const [email, setEmail] = useState('');

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleUpdateEmail = async () => {
        if (!email) {
            toast.warning("Vui lòng nhập email.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Email không hợp lệ.");
            return;
        }

        try {
            await dispatch(updateEmail({ email })).unwrap();
            toast.success("Đã gửi mã OTP đến email của bạn.");
            setShowVerify(true);
        } catch (error) {
            toast.error(error.message || "Cập nhật email thất bại.");
        }
    };

    return (
        <div className='bg-gray-50'>
            <Header/>
            <div className="px-4 md:px-8 lg:px-48 container mx-auto my-10">
                <div className="p-4 rounded bg-white shadow-lg">
                    <div className="min-h-96">
                        <span onClick={handleGoBack} className="inline-block cursor-pointer">
                            <IoReturnDownBackSharp className="inline-block" />
                            <button className="inline-block ml-5">Quay lại</button>
                        </span>
                        <div className="w-full flex flex-col items-center justify-center">
                            <p className="mt-5 text-2xl font-semibold">CẬP NHẬT EMAIL</p>
                            <p className='py-2 text-gray-400 text-sm'>Mã xác thực (OTP) sẽ được gửi đến email này để xác minh email là của bạn</p>
                            <div className="my-5 flex flex-col w-full md:w-1/2">
                                <label className="block font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Nhập email..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>
                            <button
                                onClick={handleUpdateEmail}
                                className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-5 rounded-md"
                            >
                                Cập nhật
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showVerify && (
                <VerifyEmail isVisible={showVerify} onClose={() => setShowVerify(false)} email={email} />
            )}
            <Footer/>
        </div>
    );
};

export default ChangeEmail;

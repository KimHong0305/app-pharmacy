import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoReturnDownBackSharp } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { toast } from 'react-toastify';
import { updatePassword } from '../../store/Reducers/userReducer';

const ChangePassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [checkNewPassword, setCheckNewPassword] = useState('');

    const handleGoBack = () => navigate(-1);

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !checkNewPassword) {
            toast.warning("Vui lòng nhập đầy đủ các trường.");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }

        if (newPassword !== checkNewPassword) {
            toast.error("Xác nhận mật khẩu không khớp.");
            return;
        }

        try {
            await dispatch(updatePassword({
                oldPassword,
                newPassword,
                checkNewPassword
            })).unwrap();
            toast.success("Đổi mật khẩu thành công!");
            navigate('/user/profile');
        } catch (error) {
            toast.error(error.message || "Đổi mật khẩu thất bại.");
        }
    };

    return (
        <div className='bg-gray-50'>
            <Header />
            <div className="px-4 md:px-8 lg:px-48 container mx-auto my-10">
                <div className="p-4 rounded bg-white shadow-lg">
                    <div className="min-h-96">
                        <span onClick={handleGoBack} className="inline-block cursor-pointer">
                            <IoReturnDownBackSharp className="inline-block" />
                            <button className="inline-block ml-5">Quay lại</button>
                        </span>
                        <div className="w-full flex flex-col items-center justify-center">
                            <p className="mt-5 text-2xl font-semibold">ĐỔI MẬT KHẨU</p>
                            <div className="my-5 flex flex-col w-full md:w-1/2">
                                <label className="block font-medium text-gray-700 mb-2">Mật khẩu hiện tại</label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />

                                <label className="block font-medium text-gray-700 mb-2">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />

                                <label className="block font-medium text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                                <input
                                    type="password"
                                    value={checkNewPassword}
                                    onChange={(e) => setCheckNewPassword(e.target.value)}
                                    className="w-full px-3 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />

                                <button
                                    onClick={handleChangePassword}
                                    className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-5 rounded-md"
                                >
                                    Cập nhật mật khẩu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ChangePassword;

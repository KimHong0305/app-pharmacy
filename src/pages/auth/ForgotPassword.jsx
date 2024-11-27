import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { forgotPassword, resetPassword, messageClear } from '../../store/Reducers/authReducer';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();
  const { successPassMessage, errorPassMessage, successResetMessage, errorResetMessage } = useSelector(
    (state) => state.auth
  );
  
  const dispatch = useDispatch();

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
    console.log(email)
  };
  
  useEffect(() => {
    if (successPassMessage) {
      console.log("Success:", successPassMessage);
      toast.success(successPassMessage);
      dispatch(messageClear());
      setStep(2);
    }
  
    if (errorPassMessage) {
      console.error("Error:", errorPassMessage);
      toast.error(errorPassMessage);
      dispatch(messageClear());
    }

    if (successResetMessage) {
      console.log("Password reset success:", successResetMessage);
      toast.success(successResetMessage);
      dispatch(messageClear());
      navigate("/");
    }

    if (errorResetMessage) {
      console.error("Error:", errorResetMessage);
      toast.error(errorResetMessage);
      dispatch(messageClear());
    }

  }, [successPassMessage, errorPassMessage, successResetMessage, errorResetMessage]);

  const handleResetPassword = (e) => {
    e.preventDefault();
    const info = {
      email: email,    
      otp: otp,       
      newPassword: newPassword
    };
    console.log(info)
    dispatch(resetPassword(info));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded px-8 py-10 max-w-md w-full relative">
        {/* Nút Back */}
        <button
          onClick={() => navigate("/")} // Quay lại trang chủ
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          <span className="ml-2 text-sm font-medium">Trang chủ</span>
        </button>

        {/* Form */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <h2 className="text-2xl font-bold mb-6 text-center">Quên mật khẩu</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nhập email
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Gửi mã OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            <h2 className="text-2xl font-bold mb-6 text-center">Đặt lại mật khẩu</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nhập mã OTP
              </label>
              <input
                type="text"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Mật khẩu mới
              </label>
              <input
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Đặt lại mật khẩu
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

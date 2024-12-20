import React, { useState, useRef, useCallback, useEffect } from 'react';
import { IoShieldCheckmark } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import { verifySignUp, messageClear } from '../../store/Reducers/authReducer';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const VerifyEmailSignup = ({ isVisible, onClose, email }) => {
  const [otpValue, setOtpValue] = useState('');
  const otpInputsRef = useRef([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { successVerMessage } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isVisible) {
      setOtpValue('');
    }
  }, [isVisible]);

  const handleInputChange = useCallback((index, event) => {
    const value = event.target.value;

    if (value.length === 1) {
      setOtpValue((prevValue) => prevValue + value);
      if (index < otpInputsRef.current.length - 1) {
        otpInputsRef.current[index + 1].focus();
      }
    } else if (value.length === 0 && index > 0) {
      otpInputsRef.current[index - 1].focus();
      setOtpValue((prevValue) => prevValue.slice(0, -1));
    }
  }, []);

  const handleKeyDown = useCallback((index, event) => {
    if (event.key === 'Backspace' && otpInputsRef.current[index].value === '') {
      if (index > 0) {
        otpInputsRef.current[index - 1].focus();
        setOtpValue((prevValue) => prevValue.slice(0, -1));
      }
    }
  }, [otpInputsRef]);

  const handleVerify = () => {
    dispatch(verifySignUp({ email, otp: otpValue }))
      .unwrap()
      .then(() => {
        onClose();
        toast.success(successVerMessage);
        navigate('/');
      })
      .catch((error) => {
        otpInputsRef.current.forEach((input) => (input.value = ''));
        setOtpValue('');
        toast.error(error);
        dispatch(messageClear());
      });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex flex-col items-center justify-center relative">
            <button onClick={() => onClose()} className='absolute top-1 right-1'>
            <IoCloseSharp className='h-6 w-6'/>
          </button>
          <div className='box-content h-24 w-24 bg-sky-500 rounded-full flex items-center justify-center'>
            <IoShieldCheckmark className='h-16 w-16 text-white'/>
          </div>
          <p className='mt-2 text-xl font-semibold'>XÁC THỰC EMAIL</p>
          <p className='mt-2 text-slate-500'>Nhập mã xác thực đã gửi đến email của bạn</p>
          <div className="flex justify-center items-center gap-2 my-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={el => otpInputsRef.current[index] = el}
                className="w-12 h-12 text-center text-2xl font-bold border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                onChange={(e) => handleInputChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>
            <button className="w-1/2 bg-sky-500 hover:bg-sky-700 text-white text-lg font-semibold py-2 px-4 rounded" onClick={handleVerify}
            disabled={!otpValue.trim()}  
            >
                XÁC THỰC
            </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailSignup;
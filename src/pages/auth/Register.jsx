import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { register, messageClear } from '../../store/Reducers/authReducer';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import VerifyEmailSignup from './VerifyEmailSignup';

const Register = () => {
  const [state, setState] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    dob: '',
  });

  // const [state, setState] = useState({
  //   username: 'kimhong',
  //   password: '12345678',
  //   confirmPassword: '12345678',
  //   email: 'nguyenkimhong0305@gmail.com',
  //   dob: '',
  // });

  const [showVerify, setShowVerify] = useState(false);

  const [errors, setErrors] = useState({
    username: false,
    password: false,
    confirmPassword: false,
    email: false,
    dob: false,
  });

  const { successRegMessage, errorRegMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const inputHandle = (e) => {
    const { name, value } = e.target;
    // Kiểm tra xem giá trị có thay đổi không
    if (state[name] !== value) {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: value.trim() === '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {
      username: state.username.trim() === '',
      password: state.password.trim() === '',
      confirmPassword: state.confirmPassword.trim() === '',
      email: state.email.trim() === '',
      dob: state.dob.trim() === '',
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }
    const formattedDob = formatDate(state.dob);
    const dataToSend = { ...state, dob: formattedDob };
    dispatch(register(dataToSend));
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (successRegMessage) {
      console.log("Registration successful, showing verify modal.");
      toast.success(successRegMessage);
      dispatch(messageClear());
      setShowVerify(true);
    }
    if (errorRegMessage) {
      console.error("Registration error:", errorRegMessage);
      toast.error(errorRegMessage);
      dispatch(messageClear());
    }
  }, [successRegMessage, errorRegMessage, dispatch]);

  return (
    <div>
      <Header />
      <div className="bg-slate-100 py-10">
        <div className="px-4 md:px-8 lg:px-48 container mx-auto">
          <div className='bg-white rounded-lg shadow-xl flex flex-col md:flex-row justify-between'>
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
              <p className="mt-5 text-2xl font-semibold">ĐĂNG KÝ TÀI KHOẢN</p>
              <form onSubmit={handleSubmit} className="w-full px-8 py-6">
                <div className="mb-4">
                  <label htmlFor="username" className="block text-gray-700 font-bold mb-2">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={state.username}
                    onChange={inputHandle}
                    className={`peer shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.username ? 'border-red-500' : ''}`}
                  />
                  {errors.username && (
                    <p className="mt-2 text-pink-600 text-sm">Vui lòng nhập tên đăng nhập.</p>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={state.password}
                    onChange={inputHandle}
                    className={`peer shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
                  />
                  {errors.password && (
                    <p className="mt-2 text-pink-600 text-sm">Vui lòng nhập mật khẩu.</p>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-gray-700 font-bold mb-2">
                    Xác nhận mật khẩu
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={state.confirmPassword}
                    onChange={inputHandle}
                    className={`peer shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-pink-600 text-sm">Vui lòng xác nhận mật khẩu.</p>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={state.email}
                    onChange={inputHandle}
                    placeholder='you@example.com'
                    className={`peer shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="mt-2 text-pink-600 text-sm">Vui lòng cung cấp địa chỉ email chính xác.</p>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="dob" className="block text-gray-700 font-bold mb-2">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    id="dob"
                    name="dob"
                    value={state.dob}
                    onChange={inputHandle}
                    className={`peer shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.dob ? 'border-red-500' : ''}`}
                  />
                  {errors.dob && (
                    <p className="mt-2 text-pink-600 text-sm">Vui lòng nhập ngày sinh.</p>
                  )}
                </div>
                <div className="flex items-center justify-center">
                  <button className="mt-5 w-1/3 h-10 px-3 rounded bg-sky-500 hover:bg-sky-700 text-white text-lg font-semibold" type="submit">
                    ĐĂNG KÝ
                  </button>
                </div>
              </form>
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-end hidden md:flex">
              <img src="http://localhost:3000/images/banner_doc.png" alt="Register" className="w-full max-w-[400px] rounded-lg shadow-xl" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {showVerify && (
        <VerifyEmailSignup isVisible={showVerify} onClose={() => setShowVerify(false)} email={state.email} />
      )}
    </div>
  );
};

export default Register;
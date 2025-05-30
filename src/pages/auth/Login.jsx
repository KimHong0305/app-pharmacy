import React, { useState, useEffect } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin, messageClear } from '../../store/Reducers/authReducer';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { OAuthConfig } from "../../configurations/configuration";
import { useWebSocket } from '../../contexts/WebSocketContext';

const Login = ({isVisible, onClose}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setUserInfo } = useWebSocket();

  const { role, errorMessage,successMessage } = useSelector((state) => state.auth);

  const [ state, setState ] = useState({
    username:'',
    password:''
  })

  const inputHandle = (e) =>{
    setState({
      ...state,
      [e.target.name] : e.target.value
    })
  }

  const submit = (e) => {
    e.preventDefault()
    dispatch(userLogin(state));
    console.log(state)
  }

  const handleContinueWithGoogle = () => {
    const callbackUrl = OAuthConfig.redirectUri;
    const authUrl = OAuthConfig.authUri;
    const googleClientId = OAuthConfig.clientId;

    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

    console.log(targetUrl);

    window.location.href = targetUrl;
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setState({
        username: '',
        password: '',
      });
      const username = localStorage.getItem('username');

      setUserInfo(username, role);
      if (role === 'ROLE_ADMIN'){
        navigate('/admin/dashboard');
      } else if (role === 'ROLE_EMPLOYEE') {
          navigate('/employee/dashboard');
      } else if (role === 'ROLE_NURSE') {
          navigate('/nurse/dashboard');
      } else {
        navigate('/');
      }
      onClose()
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, role, errorMessage, navigate, dispatch, onClose, setUserInfo]);

  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center'>
      <div className='w-full lg:w-1/3 md:w-1/2'>
        <div className='bg-white p-2 rounded-lg relative'>
          <button onClick={() => onClose()} className='absolute top-2 right-2'>
            <IoCloseSharp className='h-6 w-6'/>
          </button>
          <div className='my-5 mx-5'>
            <p className='text-2xl font-semibold'>Welcome back</p>
            <p className='mt-2 text-slate-500 '>Đăng nhập để hưởng những quyền lợi đặc biệt cho thành viên !</p>
            <form className='mt-5'  onSubmit={submit}>
              <div>
                <p className='font-semibold'>Tên đăng nhập</p>
                <input onChange={inputHandle} value={state.username} type="text" className='block w-full h-10 py-1.5 pl-2 mt-2 rounded border border-inherit' 
                placeholder='Nhập tên đăng nhập' id='username' required name='username'></input>
              </div>
              <div className='mt-3'>
                <p className='font-semibold'>Mật khẩu</p>
                <input onChange={inputHandle} value={state.password} type="password" className='block w-full h-10 py-1.5 pl-2 mt-2 rounded border border-inherit' 
                placeholder='Nhập mật khẩu' id='password' required name='password'></input>
              </div>
              <div className='flex justify-end'>
                <label className='mt-2 font-semibold text-sm cursor-pointer' onClick={() => navigate("/auth/forgot-password")}>
                  Quên mật khẩu?
                </label>
              </div>
              <button className="mt-5 w-full h-10 px-3 rounded bg-sky-500 hover:bg-sky-700 text-white
              text-lg font-semibold" type="submit">
                ĐĂNG NHẬP
              </button>
            </form>
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500">Hoặc</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <button className="mt-5 w-full h-10 px-3 rounded border shadow-md hover:shadow-lg
              flex items-center justify-center" type="button"
              onClick={handleContinueWithGoogle}
              >
              <FcGoogle className='h-6 w-6'/>
              <p className='ml-2 text-base font-medium'>Tiếp tục với Google</p>
            </button>
            <div className="flex justify-center items-center my-6">
              <span className="text-gray-500 mr-1">Bạn chưa có tài khoản?</span>
              <Link to="/auth/register" className="font-medium hover:text-orange-900">
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin, messageClear, logout } from '../../store/Reducers/authReducer';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWebSocket } from '../../contexts/WebSocketContext';

const EmployeeLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { role, successMessage, errorMessage } = useSelector(state => state.auth);
    const { connectWebSocket } = useWebSocket();

    const [state, setState] = useState({
        username: '',
        password: '',
    });

    const inputHandle = (e) => {
        setState({
        ...state,
        [e.target.name]: e.target.value,
        });
    };

    const submit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(userLogin(state)).unwrap();
        } catch (error) {
            const message = error?.data?.message || error?.message || "Đăng nhập thất bại!";
            toast.error(message);
            dispatch(messageClear());
        }
    };

    useEffect(() => {
        if (successMessage && role) {
            if (role === 'ROLE_USER') {
                toast.error("Tài khoản này không được phép đăng nhập ở trang nội bộ!");
                dispatch(logout());
                dispatch(messageClear());
                setState({ username: '', password: '' });
                return;
            }

            toast.success(successMessage);
            setState({ username: '', password: '' });

            switch (role) {
                case 'ROLE_ADMIN':
                    navigate('/admin/dashboard');
                    break;
                case 'ROLE_EMPLOYEE':
                    navigate('/employee/dashboard');
                    break;
                case 'ROLE_NURSE':
                    connectWebSocket(state.username, role);
                    // console.log(state.username)
                    // console.log(role)
                    navigate('/nurse/home');
                    break;
                default:
                    navigate('/');
                    break;
            }
            dispatch(messageClear());
        }

        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, role, dispatch, navigate, connectWebSocket, state.username]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Đăng nhập nhân viên</h2>
                <form onSubmit={submit}>
                <div className="mb-4">
                    <label className="block font-semibold mb-1">Tên đăng nhập</label>
                    <input
                    type="text"
                    name="username"
                    value={state.username}
                    onChange={inputHandle}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Nhập tên đăng nhập"
                    required
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold mb-1">Mật khẩu</label>
                    <input
                    type="password"
                    name="password"
                    value={state.password}
                    onChange={inputHandle}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Nhập mật khẩu"
                    required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
                >
                    Đăng nhập
                </button>
                </form>
            </div>
        </div>
    );
};

export default EmployeeLogin;
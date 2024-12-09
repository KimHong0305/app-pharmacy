import React, { useState, useEffect } from 'react';
import { loginGoogle } from '../../store/Reducers/authReducer';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Authenticate = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoggedin, setIsLoggedin] = useState(false);

    useEffect(() => {
        const handleAuth = async () => {
          console.log(window.location.href);
      
          const authCodeRegex = /code=([^&]+)/;
          const isMatch = window.location.href.match(authCodeRegex);
      
          if (isMatch) {
            const authCode = isMatch[1];
            try {
              await dispatch(loginGoogle(authCode)).unwrap();
              setIsLoggedin(true);
            } catch (error) {
              toast.error(error.message);
            }
          }
        };
      
        handleAuth();
      }, [dispatch]);
      

    useEffect(() => {
        if (isLoggedin) {
            toast.success("Đăng nhập thành công!");
            navigate("/");
        }
    }, [isLoggedin, navigate]);

    return (
        <div>
            Authenticating...
        </div>
    );
};

export default Authenticate;
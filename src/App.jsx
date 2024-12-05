import React, {useEffect} from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import publicRoutes from './router/routes/publicRoutes';
import userRoutes from './router/routes/userRoutes';
import adminRoutes from './router/routes/adminRoutes'; 
import Home from './pages/Home';
import PrivateRoute from './router/routes/PrivateRoute'; 
import MainLayout from './components/admin/MainLayout';
import employeeRoutes from './router/routes/employeeRoutes';
import { getUserInfo } from './store/Reducers/authReducer';
import { getCartGuest, getCartUser } from './store/Reducers/cartReducer';

function App() {
  const { role } = useSelector((state) => state.auth); 
  const dispatch = useDispatch()
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
        dispatch(getUserInfo())
        dispatch(getCartUser());
    }else {
      dispatch(getCartGuest());
    }

  },[token])

  return (
    <Routes>
      {/* Route công khai */}
      <Route path="/" element={<Home />} />

      {/* Hiển thị tất cả publicRoutes */}
      {publicRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      {/* Hiển thị userRoutes khi có token và role = 'ROLE_USER' */}
      {token &&
        role === 'ROLE_USER' &&
        userRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<PrivateRoute requiredRole="ROLE_USER" element={route.element} />}
          />
        ))}

      {/* Route dành cho Admin với MainLayout */}
      <Route
        path="/"
        element={<MainLayout/>}
      >
        {token &&
          role === 'ROLE_ADMIN' &&
          adminRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<PrivateRoute requiredRole="ROLE_ADMIN" element={route.element} />}
            />
          ))}
      </Route>

      {/* Route dành cho Employee với MainLayout */}
      <Route
        path="/"
        element={<MainLayout/>}
      >
        {token &&
          role === 'ROLE_EMPLOYEE' &&
          employeeRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<PrivateRoute requiredRole="ROLE_EMPLOYEE" element={route.element} />}
            />
          ))}
      </Route>
    </Routes>
  );
}

export default App;
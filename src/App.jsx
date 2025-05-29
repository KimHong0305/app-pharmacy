import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import publicRoutes from './router/routes/publicRoutes';
import userRoutes from './router/routes/userRoutes';
import adminRoutes from './router/routes/adminRoutes';
import employeeRoutes from './router/routes/employeeRoutes';
import Home from './pages/Home';
import PrivateRoute from './router/routes/PrivateRoute';
import MainLayout from './components/admin/MainLayout';
import { getUserInfo } from './store/Reducers/authReducer';
import { getCartGuest, getCartUser, transfer } from './store/Reducers/cartReducer';
import Unauthorized from './pages/Unauthorized';
import ContactFloating from './components/ContactFloating';
import nurseRoutes from './router/routes/nurseRoutes';

function App() {
  const { role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      dispatch(getUserInfo());
      dispatch(transfer()).then(() => {
        dispatch(getCartUser());
      });
    } else {
      dispatch(getCartGuest());
    }
  }, [dispatch, token]);

  return (
    <>
      {(!role || role === 'ROLE_USER') && <ContactFloating />}
      <Routes>
        <Route path="/" element={<Home />} />
        
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {userRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <PrivateRoute
                requiredRole="ROLE_USER"
                element={route.element}
              />
            }
          />
        ))}

        <Route path="/" element={<MainLayout />}>
          {[...adminRoutes, ...employeeRoutes, ...nurseRoutes].map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <PrivateRoute
                  requiredRole={
                    route.role ?? ['ROLE_ADMIN', 'ROLE_EMPLOYEE', 'ROLE_NURSE']
                  }
                  element={route.element}
                />
              }
            />
          ))}
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </>
  );
}

export default App;
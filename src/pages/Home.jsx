import React, {useEffect} from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import NewProducts from '../components/Products/NewProducts';
import BestProducts from '../components/Products/BestProducts';
import Footer from '../components/Footer';
import TopCompany from '../components/Products/TopCompany';
import { useDispatch } from 'react-redux';
import { getHome } from '../store/Reducers/homeReducer';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const Home = () => {

  const dispatch = useDispatch();

  const { role } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getHome());
  }, [dispatch]);

  if (role === 'ROLE_ADMIN') {
    return <Navigate to="/admin/dashboard" />
  } else if (role === 'ROLE_EMPLOYEE') {
    return <Navigate to="/employee/dashboard" />
  }  

  return (
    <div>
      <Header />
      <div className="w-full">
        <Banner/>
        <div className='px-4 md:px-8 lg:px-48'>
          {/* Sản phẩm mới */}
          <NewProducts/>
          <BestProducts/>
          <TopCompany/>
        </div>
      </div>
    <Footer/>
    </div>
  );
};

export default Home;
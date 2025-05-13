import React, {useEffect} from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import NewProducts from '../components/Products/NewProducts';
import BestProducts from '../components/Products/BestProducts';
import Footer from '../components/Footer';
import TopCompany from '../components/Products/TopCompany';
import { useDispatch } from 'react-redux';
import { getHome } from '../store/Reducers/homeReducer';

const Home = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getHome());
  }, [dispatch]);  

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
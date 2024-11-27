import React from 'react';
import Header from '../../components/Header';
import Banner from '../../components/Banner';
import NewProducts from '../../components/Products/NewProducts';
import BestProducts from '../../components/Products/BestProducts';
import Footer from '../../components/Footer';

const HomeUser = () => {
  return (
    <div>
      <Header />
      <div className="w-full">
        <Banner/>
        <div className='px-4 md:px-8 lg:px-48'>
          {/* Sản phẩm mới */}
          <NewProducts/>
          <BestProducts/>
        </div>
      </div>
    <Footer/>
    </div>
  );
};

export default HomeUser;
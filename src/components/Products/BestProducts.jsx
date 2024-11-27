import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { FaHeart } from "react-icons/fa";

const BestProducts = () => {
  return (
    <div className='my-10'>
      <p className="text-xl uppercase font-semibold mt-2">Sản phẩm bán chạy</p>
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={24}
        slidesPerView={'auto'}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
            0: {
              slidesPerView: 1, 
            },
            450: {
              slidesPerView: 2,
            },
            600: {
                slidesPerView: 3,
            },
            1200: {
              slidesPerView: 4,
            },
            1380: {
              slidesPerView: 5,
            },
          }}
        className="my-5"
      >
        <SwiperSlide>
          <div className="static flex flex-col items-center justify-center border border-[#6ec2f7] w-[200px] h-[250px] 
          shadow-lg hover:shadow-2xl bg-[#ffffff] mr-5 rounded-lg">
            <button className='absolute top-2 left-40'>
              <FaHeart className='h-6 w-6 text-red-600'/>
            </button> 
            <img className="size-[130px]" src="http://localhost:3000/images/product.jpg" alt="Product1"/>
            <span className='mt-1 font-sans font-medium text-lg'>Thuốc ho trẻ em Coji</span>
            <span className='mt-1 font-medium font-semibold text-[#27a4f2] text-lg'>50.000 đ/Chai</span>
            <button className="mt-1 h-8 px-3 rounded-lg bg-sky-500 hover:bg-sky-700 text-white" type="submit">
              Chọn sản phẩm
            </button>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="static flex flex-col items-center justify-center border border-[#6ec2f7] w-[200px] h-[250px] 
          shadow-lg hover:shadow-2xl bg-[#ffffff] mr-5 rounded-lg">
            <button className='absolute top-2 left-40'>
              <FaHeart className='h-6 w-6 text-red-600'/>
            </button> 
            <img className="size-[130px]" src="http://localhost:3000/images/product.jpg" alt="Product1"/>
            <span className='mt-1 font-sans font-medium text-lg'>Thuốc ho trẻ em Coji</span>
            <span className='mt-1 font-medium font-semibold text-[#27a4f2] text-lg'>50.000 đ/Chai</span>
            <button className="mt-1 h-8 px-3 rounded-lg bg-sky-500 hover:bg-sky-700 text-white" type="submit">
              Chọn sản phẩm
            </button>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="static flex flex-col items-center justify-center border border-[#6ec2f7] w-[200px] h-[250px] 
          shadow-lg hover:shadow-2xl bg-[#ffffff] mr-5 rounded-lg">
            <button className='absolute top-2 left-40'>
              <FaHeart className='h-6 w-6 text-red-600'/>
            </button> 
            <img className="size-[130px]" src="http://localhost:3000/images/product.jpg" alt="Product1"/>
            <span className='mt-1 font-sans font-medium text-lg'>Thuốc ho trẻ em Coji</span>
            <span className='mt-1 font-medium font-semibold text-[#27a4f2] text-lg'>50.000 đ/Chai</span>
            <button className="mt-1 h-8 px-3 rounded-lg bg-sky-500 hover:bg-sky-700 text-white" type="submit">
              Chọn sản phẩm
            </button>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="static flex flex-col items-center justify-center border border-[#6ec2f7] w-[200px] h-[250px] 
          shadow-lg hover:shadow-2xl bg-[#ffffff] mr-5 rounded-lg">
            <button className='absolute top-2 left-40'>
              <FaHeart className='h-6 w-6 text-red-600'/>
            </button> 
            <img className="size-[130px]" src="http://localhost:3000/images/product.jpg" alt="Product1"/>
            <span className='mt-1 font-sans font-medium text-lg'>Thuốc ho trẻ em Coji</span>
            <span className='mt-1 font-medium font-semibold text-[#27a4f2] text-lg'>50.000 đ/Chai</span>
            <button className="mt-1 h-8 px-3 rounded-lg bg-sky-500 hover:bg-sky-700 text-white" type="submit">
              Chọn sản phẩm
            </button>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="static flex flex-col items-center justify-center border border-[#6ec2f7] w-[200px] h-[250px] 
          shadow-lg hover:shadow-2xl bg-[#ffffff] mr-5 rounded-lg">
            <button className='absolute top-2 left-40'>
              <FaHeart className='h-6 w-6 text-red-600'/>
            </button> 
            <img className="size-[130px]" src="http://localhost:3000/images/product.jpg" alt="Product1"/>
            <span className='mt-1 font-sans font-medium text-lg'>Thuốc ho trẻ em Coji</span>
            <span className='mt-1 font-medium font-semibold text-[#27a4f2] text-lg'>50.000 đ/Chai</span>
            <button className="mt-1 h-8 px-3 rounded-lg bg-sky-500 hover:bg-sky-700 text-white" type="submit">
              Chọn sản phẩm
            </button>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="static flex flex-col items-center justify-center border border-[#6ec2f7] w-[200px] h-[250px] 
          shadow-lg hover:shadow-2xl bg-[#ffffff] mr-5 rounded-lg">
            <button className='absolute top-2 left-40'>
              <FaHeart className='h-6 w-6 text-red-600'/>
            </button> 
            <img className="size-[130px]" src="http://localhost:3000/images/product.jpg" alt="Product1"/>
            <span className='mt-1 font-sans font-medium text-lg'>Thuốc ho trẻ em Coji</span>
            <span className='mt-1 font-medium font-semibold text-[#27a4f2] text-lg'>50.000 đ/Chai</span>
            <button className="mt-1 h-8 px-3 rounded-lg bg-sky-500 hover:bg-sky-700 text-white" type="submit">
              Chọn sản phẩm
            </button>
          </div>
        </SwiperSlide>
        {/* Các slide khác tương tự */}
      </Swiper>
    </div>
  );
};

export default BestProducts;
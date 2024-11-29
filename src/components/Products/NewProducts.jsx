import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { FaHeart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { getAllProducts } from '../../store/Reducers/productReducer';
import { useDispatch, useSelector } from 'react-redux';

const NewProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allProducts } = useSelector((state) => state.product);

  const page = 0;
  const size = 10;
  useEffect(() => {
    dispatch(getAllProducts({ page, size }));
  }, [dispatch]);

  const handleProductClick = (productId) => {
    navigate(`/productDetail/${productId}`);
  };

  return (
    <div className='my-10'>
      <p className="text-xl uppercase font-semibold mt-2">Sản phẩm mới</p>
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
        {allProducts.map((product) => (
          <SwiperSlide key={product.id}>
            <div
              className="static flex flex-col items-center justify-center border border-[#6ec2f7] w-[200px] h-[280px] 
              shadow-lg hover:shadow-2xl bg-[#ffffff] mr-5 rounded-lg"
              onClick={() => handleProductClick(product.id)}
            >
              <button className='absolute top-2 left-40'>
                <FaHeart className='h-6 w-6 text-red-600'/>
              </button>
              <img className="size-[130px]" src={product.image} alt={product.name}/>
              <span className={`mt-1 font-sans font-medium px-2 w-full overflow-hidden text-ellipsis line-clamp-2 text-center 
                ${product.name.split('\n').length > 1 ? '' : 'h-12'}`}>
                {product.name}
              </span>
              <span className='mt-1 font-medium font-semibold text-[#27a4f2] text-lg'>
                {product.prices[0]?.price.toLocaleString('vi-VN')} đ / {product.prices[0]?.unit.name}
              </span>

              <button className="mt-1 h-8 px-3 rounded-lg bg-sky-500 hover:bg-sky-700 text-white">
                Chọn sản phẩm
              </button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default NewProducts;
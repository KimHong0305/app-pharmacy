import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import '../styles/slick-theme.css';
import React from 'react';

const Banner = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const images = [
    'http://localhost:3000/images/Banner1.jpg',
    'http://localhost:3000/images/Banner2.jpg',
    'http://localhost:3000/images/Banner3.jpg',
  ];

  return (
    <div>
      <Slider {...settings}>
        {images.map((imageUrl, index) => (
          <div key={index}>
            <img
              src={imageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
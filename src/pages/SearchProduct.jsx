import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Footer from '../components/Footer';
import Header from '../components/Header';

const SearchProduct = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const products = useSelector((state) => state.product.products);

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';

  const handleProductClick = (productId) => {
    navigate(`/productDetail/${productId}`);
  };

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredProducts([]);
    } else {
      const results = products.filter((product) =>
        product?.name?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(results);
    }
  }, [query, products]);

  console.log('san pham', products)

  return (
    <div>
      <Header />
      <div className="px-4 md:px-8 lg:px-48 container mx-auto my-10">
        <p className="text-2xl font-semibold">Kết quả tìm kiếm</p>
        <p className="text-lg text-gray-600">Kết quả cho "{query}"</p>
        <div className="container relative grid grid-cols-1 items-start gap-3 md:grid-cols-[193px,1fr]">
            {/* Bộ lọc */}
            <div class="px-1">
                <div className='flex justify-between py-5'>
                    <p className='font-semibold'>Bộ lọc</p>
                    <button className='text-blue-600 font-semibold'>Thiết lập lại</button>
                </div>
                <div className='grid gap-4'>
                    <p className='text-sm font-semibold'>Khoảng giá</p>
                    <div className="flex items-center border border-gray-300 rounded-md px-3 py-1 w-full">
                        <input
                            type="text"
                            placeholder="Tối thiểu"
                            className="flex-1 bg-transparent focus:outline-none text-gray-900 placeholder-gray-500 w-0"
                        />
                        <span className="text-gray-500 ml-1">đ</span>
                    </div>
                    <div className="flex items-center border border-gray-300 rounded-md px-3 py-1 w-full">
                        <input
                            type="text"
                            placeholder="Tối đa"
                            className="flex-1 bg-transparent focus:outline-none text-gray-900 placeholder-gray-500 w-0"
                        />
                        <span className="text-gray-500 ml-1">đ</span>
                    </div>
                    <button className='w-full h-8 px-3 rounded-md bg-sky-500 hover:bg-sky-700 text-white text-sm font-semibold'>
                        Áp dụng
                    </button>
                    <p className='text-sm font-semibold'>Khoảng giá</p>
                    <div className="flex items-center border border-gray-300 rounded-md px-3 py-1 w-full">
                        <input
                            type="text"
                            placeholder="Nhập tên thương hiệu"
                            className="flex-1 bg-transparent focus:outline-none text-gray-900 placeholder-gray-500 w-0"
                        />
                    </div>
                </div>
            </div>

          {/* Danh sách sản phẩm */}
          <div className="px-1">
            <div className="flex py-3">
              <div className="flex gap-4 items-center justify-start">
                <p className="text-sm font-semibold">Sắp xếp theo: </p>
                <button className="px-4 py-2 border rounded-md text-gray-600 border-gray-300 hover:bg-gray-100 text-sm font-semibold">
                  Giá giảm dần
                </button>
                <button className="px-4 py-2 border rounded-md text-gray-600 border-gray-300 hover:bg-gray-100 text-sm font-semibold">
                  Giá tăng dần
                </button>
              </div>
            </div>

            {/* Hiển thị sản phẩm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col items-center justify-center border border-[#6ec2f7] w-[200px] h-[280px] shadow-lg hover:shadow-2xl bg-[#ffffff] rounded-lg"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <img
                      className="h-[130px] object-cover"
                      src={product.image}
                      alt={product.name}
                    />
                    <span className="mt-1 font-medium text-center">
                      {product.name}
                    </span>
                    <span className="mt-1 font-medium font-semibold text-[#27a4f2] text-lg">
                        {product.prices?.[0]?.price?.toLocaleString('vi-VN')} đ / {product.prices?.[0]?.unit?.name}
                    </span>
                    <button className="mt-1 h-8 px-3 rounded-lg bg-sky-500 hover:bg-sky-700 text-white">
                      Chọn sản phẩm
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center col-span-4">Không có sản phẩm nào phù hợp với tìm kiếm của bạn!</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchProduct;

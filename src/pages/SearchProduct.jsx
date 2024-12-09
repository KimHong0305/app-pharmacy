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

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minPriceDisplay, setMinPriceDisplay] = useState("");
  const [maxPriceDisplay, setMaxPriceDisplay] = useState("");
  const [sortOrder, setSortOrder] = useState('');

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';

  const handleProductClick = (productId) => {
    navigate(`/productDetail/${productId}`);
  };

  const formatCurrency = (value) => {
    return value
      ? new Intl.NumberFormat("vi-VN").format(parseInt(value, 10))
      : "";
  };

  const handleMinPriceChange = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setMinPrice(numericValue);
    setMinPriceDisplay(formatCurrency(numericValue));
  };

  const handleMaxPriceChange = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    setMaxPrice(numericValue);
    setMaxPriceDisplay(formatCurrency(numericValue));
  };

  useEffect(() => {
    if (query.trim() === '') {
      setFilteredProducts([]);
    } else {
      let results = products.filter((product) =>
        product?.name?.toLowerCase().includes(query.toLowerCase())
      );

      // Sắp xếp sản phẩm theo lựa chọn của người dùng
      if (sortOrder === 'asc') {
        results.sort((a, b) => (a.prices?.[0]?.price || 0) - (b.prices?.[0]?.price || 0));
      } else if (sortOrder === 'desc') {
        results.sort((a, b) => (b.prices?.[0]?.price || 0) - (a.prices?.[0]?.price || 0));
      }

      setFilteredProducts(results);
    }
  }, [query, products, sortOrder]);

  const handleApplyFilter = () => {
    if (!products || products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    const filtered = products.filter((product) => {
      const price = product.prices?.[0]?.price || 0;
      const isValidMin = minPrice ? price >= parseFloat(minPrice) : true;
      const isValidMax = maxPrice ? price <= parseFloat(maxPrice) : true;
      return isValidMin && isValidMax;
    });

    setFilteredProducts(filtered);
  };

  console.log('san pham', products);

  return (
    <div>
      <Header />
      <div className="px-4 md:px-8 lg:px-48 container mx-auto my-5">
        <p className="text-2xl font-semibold">Kết quả tìm kiếm</p>
        <p className="text-lg text-gray-600">Kết quả cho "{query}"</p>
        <div className="container relative grid grid-cols-1 items-start gap-3 md:grid-cols-[193px,1fr]">
          {/* Bộ lọc */}
          <div className="px-1">
            <div className='flex justify-between py-5'>
              <p className='font-semibold'>Bộ lọc</p>
              <button
                className='text-blue-600 font-semibold'
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                  setMinPriceDisplay("");
                  setMaxPriceDisplay("");
                  setFilteredProducts(products);
                }}
              >
                Thiết lập lại
              </button>
            </div>
            <div className="grid gap-4">
              <p className="text-sm font-semibold">Khoảng giá</p>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-1 w-full">
                <input
                  type="text"
                  placeholder="Tối thiểu"
                  value={minPriceDisplay}
                  onChange={handleMinPriceChange}
                  className="flex-1 bg-transparent focus:outline-none text-gray-900 placeholder-gray-500 w-0"
                />
                <span className="text-gray-500 ml-1">đ</span>
              </div>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-1 w-full">
                <input
                  type="text"
                  placeholder="Tối đa"
                  value={maxPriceDisplay}
                  onChange={handleMaxPriceChange}
                  className="flex-1 bg-transparent focus:outline-none text-gray-900 placeholder-gray-500 w-0"
                />
                <span className="text-gray-500 ml-1">đ</span>
              </div>
              <button
                className="w-full h-8 px-3 rounded-md bg-sky-500 hover:bg-sky-700 text-white text-sm font-semibold"
                onClick={handleApplyFilter}
              >
                Áp dụng
              </button>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="px-1">
            <div className="flex py-3">
              <div className="flex gap-4 items-center justify-start">
                <p className="text-sm font-semibold">Sắp xếp theo: </p>
                <button
                  className={`px-4 py-2 border rounded-md text-sm font-semibold ${
                      sortOrder === "asc"
                      ? "border-blue-600 text-blue-600"
                      : "text-gray-600 border-gray-300 hover:bg-gray-100"
                  }`}
                  onClick={() => setSortOrder('asc')}
                  >
                  Giá tăng dần
                </button>
                <button
                    className={`px-4 py-2 border rounded-md text-sm font-semibold ${
                        sortOrder === "desc"
                        ? "border-blue-600 text-blue-600"
                        : "text-gray-600 border-gray-300 hover:bg-gray-100"
                    }`}
                    onClick={() => setSortOrder('desc')}
                    >
                    Giá giảm dần
                </button>
              </div>
            </div>

            {/* Hiển thị sản phẩm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col items-center justify-center border border-gray-300 w-[200px] h-[280px] hover:shadow-2xl bg-[#ffffff] rounded-lg"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <img
                      className="h-[130px] object-cover"
                      src={product.image}
                      alt={product.name}
                    />
                    <span className={`mt-1 font-sans font-medium px-2 w-full overflow-hidden text-ellipsis line-clamp-2 text-center ${product.name.split('\n').length > 1 ? '' : 'h-12'}`}>
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

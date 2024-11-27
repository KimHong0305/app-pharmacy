import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getProductByCategory } from '../store/Reducers/productReducer';
import Footer from '../components/Footer';
import Header from '../components/Header';

const ProductList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const categoryName = location.state?.categoryName;
    const { categoryId } = useParams();
    const products = useSelector((state) => state.product.products);

    useEffect(() => {
        dispatch(getProductByCategory(categoryId));
    }, [dispatch, categoryId]);

    const handleProductClick = (productId) => {
        navigate(`/productDetail/${productId}`);
    };

    console.log('san pham', products)

    return (
        <div>
            <Header />
            <div className="px-4 md:px-8 lg:px-48 container mx-auto my-10">
                <p className="text-2xl font-semibold">{categoryName}</p>
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
                            {products.length > 0 ? (
                                products.map((item) => (
                                <div
                                    key={item.id}
                                    className="static flex flex-col items-center justify-center border border-[#6ec2f7] w-[200px] h-[280px] shadow-lg hover:shadow-2xl bg-[#ffffff] mr-5 rounded-lg"
                                    onClick={() => handleProductClick(item.id)}
                                >
                                    <img
                                    className="h-[130px] object-cover"
                                    src={item.image}
                                    alt={item.name}
                                    />
                                    <span
                                    className={`mt-1 font-sans font-medium px-2 w-full overflow-hidden text-ellipsis line-clamp-2 text-center ${item.name.split('\n').length > 1 ? '' : 'h-12'}`}
                                    >
                                    {item.name}
                                    </span>
                                    <span className="mt-1 font-medium font-semibold text-[#27a4f2] text-lg">
                                    {item.prices?.[0]?.price?.toLocaleString('vi-VN')} đ / {item.prices?.[0]?.unit?.name}
                                    </span>
                                    <button className="mt-1 h-8 px-3 rounded-lg bg-sky-500 hover:bg-sky-700 text-white">
                                    Chọn sản phẩm
                                    </button>
                                </div>
                                ))
                            ) : (
                                <p className="text-center col-span-4">Không có sản phẩm nào!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductList;

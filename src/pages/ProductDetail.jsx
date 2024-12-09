import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import '../styles/slick-theme.css';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById } from '../store/Reducers/productReducer';
import { useNavigate, useParams } from 'react-router-dom';
import { PiTrademarkDuotone } from "react-icons/pi";
import { addCartGuest, addCartUser, messageClear } from '../store/Reducers/cartReducer';
import { toast } from 'react-toastify';

const ProductDetail = () => {
    const token = localStorage.getItem('token');

    const slider1Ref = useRef(null);
    const slider2Ref = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { productId } = useParams();

    const { product } = useSelector((state) => state.product);
    const { message, messageError } = useSelector((state) => state.cart);

    const [quantity, setQuantity] = useState(1);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [productImages, setProductImages] = useState([]);

    const settings1 = {
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: slider2Ref.current,
    };

    const settings2 = {
        dots: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: slider1Ref.current,
        focusOnSelect: true,
        swipeToSlide: true,
    };

    useEffect(() => {
        dispatch(getProductById(productId));
    }, [dispatch, productId]);

    console.log(product)

    useEffect(() => {
        if (product?.length > 0) {
            setProductImages(product[0].images);
            setSelectedUnit(product[0].price.unit.name);
        }
    }, [product]);

    const handleAddToCart = () => {
        const selectedProduct = product.find((p) => p.price.unit.name === selectedUnit);
        const newItem = {
            priceId: selectedProduct?.price.id,
            quantity,
        };
        if (token) {
            dispatch(addCartUser({ item: newItem, token }));
        } else {
            dispatch(addCartGuest(newItem));
        }
    };

    const handleOrder = () => {
        const selectedProduct = product.find((p) => p.price.unit.name === selectedUnit);
        if (token) {
            navigate('/orderUser', { state: selectedProduct })
        } else {
            toast.warning("Vui lòng đăng nhập để mua hàng!");
        }
    }

    const getProductPrice = () => {
        if (selectedUnit && product?.length > 0) {
            const selectedProduct = product.find((p) => p.price.unit.name === selectedUnit);
            return selectedProduct?.price.price || 0;
        }
        return product?.[0]?.price?.price || 0;
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncreaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    useEffect(() => {
        if (message) {
            toast.success('Thêm vào giỏ hàng thành công');
            dispatch(messageClear());
        }
        if (messageError) {
            toast.error(messageError);
            dispatch(messageClear());
        }
    }, [message, messageError, dispatch]);

    const renderTextWithLineBreaks = (text) => {
        if (!text) return null;
        // Thay \\n bằng \n và chia nhỏ thành dòng
        return text.replace(/\\n/g, '\n').split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };    
    

    return (
        <div>
            <Header />
            <div className="px-4 md:px-8 lg:px-48 container mx-auto my-10">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Slider */}
                    <div className='md:col-span-2'>
                    <Slider
                        className="slider-for"
                        {...settings1}
                        ref={slider1Ref}
                    >
                        {productImages.map((image, index) => (
                            <div key={index}>
                                <img
                                    className="w-full h-auto rounded-lg"
                                    src={image}
                                    alt={`Product ${index + 1}`}
                                />
                            </div>
                        ))}
                    </Slider>
                    {productImages.length > 1 && (
                        <Slider
                            className="slider-nav"
                            {...settings2}
                            ref={slider2Ref}
                        >
                            {productImages.map((image, index) => (
                                <div key={index}>
                                    <img
                                        className="w-full h-auto rounded-lg"
                                        src={image}
                                        alt={`Product ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </Slider>
                    )}
                    </div>
                    {/* Product details */}
                    <div className='md:col-span-2'>
                        <h1 className="text-2xl font-bold mb-2">{product?.[0]?.name}</h1>
                        <div className='flex items-center text-gray-400 mb-2'>
                            <PiTrademarkDuotone />
                            <p className="font-medium ml-2">
                                Thương hiệu: {product?.[0]?.company.name}
                            </p>
                        </div>
                        <div className="flex items-center mb-2">
                            <span className="text-2xl font-bold text-blue-900 mr-2">
                                {getProductPrice().toLocaleString('vi-VN')} đ /{selectedUnit}
                            </span>
                        </div>
                        <div className="flex-grow border-t border-gray-400"></div>
                        <div>
                            <p className="text-base font-medium text-gray-700 my-2">Phân loại sản phẩm</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {product?.map((p, index) => (
                                    p.price.unit.name && (
                                        <button
                                            key={`unit-${index}`}
                                            className={`border border-slate-300 hover:bg-slate-200 text-xs font-medium w-16 py-2 px-4 rounded-lg ${selectedUnit === p.price.unit.name ? 'bg-sky-100 text-sky-950' : ''}`}
                                            onClick={() => setSelectedUnit(p.price.unit.name)}
                                        >
                                            {p.price.unit.name}
                                        </button>
                                    )
                                ))}
                            </div>
                        </div>
                        <div className="flex-grow border-t border-gray-400"></div>
                            <div>
                                <p className="text-xl font-semibold my-2">Lợi ích</p>
                                <div>{renderTextWithLineBreaks(product?.[0]?.benefits)}</div>
                                
                                <p className="text-xl font-semibold my-2">Thành phần</p>
                                <div>{renderTextWithLineBreaks(product?.[0]?.ingredients)}</div>
                                
                                <p className="text-xl font-semibold my-2">Chống chỉ định</p>
                                <div>{renderTextWithLineBreaks(product?.[0]?.constraindication)}</div>
                                
                                <p className="text-xl font-semibold my-2">Cách sử dụng</p>
                                <div>{renderTextWithLineBreaks(product?.[0]?.instruction)}</div>
                                
                                <p className="text-xl font-semibold my-2">Lưu ý</p>
                                <div>{renderTextWithLineBreaks(product?.[0]?.note)}</div>
                                
                                <p className="text-xl font-semibold my-2">Điều kiện bảo quản</p>
                                <div>{renderTextWithLineBreaks(product?.[0]?.preserve)}</div>
                            </div>
                        </div>
                    <div className="fixed md:col-span-1 rounded border border-inherit flex flex-col items-center top-40 right-20">
                        <a className='mt-5 font-bold'>Số lượng</a>
                        <div className="quantity-container flex items-center my-4">
                            <button
                                className="bg-slate-300 hover:bg-slate-200 text-xs font-medium py-2 px-4 rounded-full"
                                onClick={handleDecreaseQuantity}
                            >
                                -
                            </button>
                            <input
                                type="text"
                                className="w-12 text-center mx-2 border-none focus:outline-none"
                                value={quantity}
                                readOnly
                            />
                            <button
                                className="bg-slate-300 hover:bg-slate-200 text-xs font-medium py-2 px-4 rounded-full"
                                onClick={handleIncreaseQuantity}
                            >
                                +
                            </button>
                        </div>
                        <div className='mx-5'>
                            <button className="mt-5 w-full bg-sky-500 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded"
                            onClick={handleOrder}>
                                Mua ngay
                            </button>
                            <button className="my-5 w-full font-medium text-inherit hover:bg-slate-200 py-2 px-4 rounded border border-inherit"
                            onClick={handleAddToCart}>
                                Thêm vào giỏ
                            </button>
                        </div>
                    </div>
                    <div className='md:col-span-1'>

                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetail;

import React, { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import '../styles/slick-theme.css';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById } from '../store/Reducers/productReducer';
import { useNavigate, useParams } from 'react-router-dom';
import { PiTrademarkDuotone } from "react-icons/pi";
import { addCartGuest, addCartUser} from '../store/Reducers/cartReducer';
import { toast } from 'react-toastify';
import { getFeedbackByProduct, getReplyFeedback, setReply } from '../store/Reducers/feedback/feedbackReducer';
const ProductDetail = () => {
    const token = localStorage.getItem('token');

    const slider1Ref = useRef(null);
    const slider2Ref = useRef(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);


    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { productId } = useParams();

    const { product } = useSelector((state) => state.product);
    const { feedbacks, reply } = useSelector((state) => state.feedback);

    const [quantity, setQuantity] = useState(1);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [productImages, setProductImages] = useState([]);
    const [activeTab, setActiveTab] = useState('benefits');

    const settings1 = {
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: slider2Ref.current,
    };

    const settings2 = {
        dots: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: slider1Ref.current,
        focusOnSelect: true,
        swipeToSlide: true,
    };

    const onSliderChange = (index) => {
        setActiveImageIndex(index);
    };      

    useEffect(() => {
        dispatch(getProductById(productId));
        dispatch(getFeedbackByProduct(productId));
    }, [dispatch, productId]);

    useEffect(() => {
        if (feedbacks?.length) {
            feedbacks.forEach((feedback) => {
                dispatch(getReplyFeedback(feedback.id)).then((response) => {
                    const replyData = response?.result?.[0];
                    if (replyData) {
                        dispatch(setReply({
                            feedbackId: feedback.id,
                            reply: replyData.feedback,
                            username: replyData.username,
                            avatar: replyData.avatar,
                            createDate: replyData.createDate
                        }));
                    }
                });
            });
            console.log('reply', reply)
        }
    }, [feedbacks, dispatch]);
    
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
            toast.success('Thêm vào giỏ hàng thành công');
        } else {
            dispatch(addCartGuest(newItem));
            toast.success('Thêm vào giỏ hàng thành công');
        }
    };

    const handleOrder = () => {
        const selectedProduct = product.find((p) => p.price.unit.name === selectedUnit);
        if (token) {
            navigate('/orderUser', { state: selectedProduct })
        } else {
            navigate('/order', { state: selectedProduct })
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

    const tabs = [
        { key: "benefits", label: "Lợi ích" },
        { key: "ingredients", label: "Thành phần" },
        { key: "constraindication", label: "Chống chỉ định" },
        { key: "object_use", label: "Đối tượng sử dụng" },
        { key: "instruction", label: "Hướng dẫn sử dụng" },
        { key: "preserve", label: "Bảo quản" },
        { key: "note", label: "Ghi chú" },
    ];
    
    const validTabs = tabs.filter(
        (tab) => product?.[0]?.[tab.key]?.trim()
    );

    return (
        <div>
            <Header />
            <div className="px-4 md:px-8 lg:px-48 container mx-auto my-10">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 pb-2">
                    {/* Slider */}
                    <div className='md:col-span-2 flex items-start justify-center'>
                        <div className='w-4/5'>
                        <Slider
                            className="slider-for"
                            {...settings1}
                            ref={slider1Ref}
                            afterChange={(index) => onSliderChange(index)}
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

                            {/* Slider nhỏ */}
                            {productImages.length > 1 && (
                            <Slider
                                className="slider-nav"
                                {...settings2}
                                ref={slider2Ref}
                            >
                                {productImages.map((image, index) => (
                                <div key={index}>
                                    <img
                                    className={`w-4/5 h-auto rounded-lg cursor-pointer ${index === activeImageIndex ? 'border-2 border-sky-500' : ''}`}
                                    src={image}
                                    alt={`Product ${index + 1}`}
                                    onClick={() => slider1Ref.current.slickGoTo(index)}
                                    />
                                </div>
                                ))}
                            </Slider>
                            )}
                        </div>
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
                        <div className="flex-grow border-t border-gray-300"></div>
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
                        <div className="flex-grow border-t border-gray-300"></div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 my-2">
                            <div>
                                <p className="text-base font-medium text-gray-700">Danh mục</p>
                            </div>
                            <div className='md:col-span-2'>
                                {product?.[0]?.category.name}
                            </div>

                            <div>
                                <p className="text-base font-medium text-gray-700">Công dụng</p>
                            </div>
                            <div className='md:col-span-2'>
                                {product?.[0]?.benefits}
                            </div>

                            <div>
                                <p className="text-base font-medium text-gray-700">Nhà sản xuất</p>
                            </div>
                            <div className='md:col-span-2'>
                                {product?.[0]?.company.name}
                            </div>
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
                <div className='w-5/6 border-t border-gray-300 py-2'>
                    {/* Tabs */}
                    <div className="bg-white text-base font-semibold">
                        {/* Render các tab động */}
                        {validTabs.map((tab) => (
                            <button
                            key={tab.key}
                            className={`cursor-pointer px-4 py-2 ${
                                activeTab === tab.key
                                ? 'inline-block border-b-2 border-sky-600 text-sky-600'
                                : 'text-black'
                            }`}
                            onClick={() => setActiveTab(tab.key)}
                            >
                            {tab.label}
                            </button>
                        ))}
                    </div>

                        {/* Render thông tin theo tab */}
                    <div>
                        {validTabs.map(
                            (tab) =>
                            activeTab === tab.key && (
                                <div key={tab.key}>
                                <p className="text-xl font-semibold my-2">{tab.label}</p>
                                <div>{renderTextWithLineBreaks(product?.[0]?.[tab.key])}</div>
                                </div>
                            )
                        )}
                    </div>
                </div>
                
                <div className='w-5/6 border-t border-gray-300 py-4'>
                    <p className="text-xl font-semibold my-2">Đánh giá</p>
                    <div>
                        {feedbacks?.length > 0 ? (
                        feedbacks.map((feedback) => (
                            <div key={feedback.id} className="feedback-item border p-3 rounded-md shadow-sm mb-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                <img
                                    src={feedback.avatar}
                                    alt={feedback.username}
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                                <p className="font-semibold">{feedback.username}</p>
                                </div>
                                <div>
                                <p className="text-sm text-gray-600">{feedback.createDate}</p>
                                </div>
                            </div>
                            <p className="text-base">{feedback.feedback}</p>
                            {/* Reply Section */}
                            <div className="reply-section mt-3 p-3 bg-sky-100 border rounded-md">
                            {reply?.[feedback.id] ? (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <img
                                                src="http://localhost:3000/images/avata_1.png"
                                                alt={reply[feedback.id].username}
                                                className="w-10 h-10 rounded-full mr-3"
                                            />
                                            <p className="font-semibold">{reply[feedback.id].username}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">{reply[feedback.id].createDate}</p>
                                        </div>
                                    </div>
                                    <p className="text-base">{reply[feedback.id].reply}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400">Chưa có phản hồi</p>
                            )}

                        </div>
                        </div>
                        ))
                        ) : (
                        <p>Chưa có đánh giá nào</p>
                        )}
                    </div>
                    </div>


                </div>
            <Footer />
        </div>
    );
};

export default ProductDetail;

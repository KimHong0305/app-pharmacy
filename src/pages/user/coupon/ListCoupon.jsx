import React, {useEffect} from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import UserNavBar from "../../../components/UserNavBar";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../../../store/Reducers/authReducer';
import { getCouponUser } from '../../../store/Reducers/couponReducer';

const ListCoupon = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { bio } = useSelector((state) => state.auth);   
    const { coupons } = useSelector((state) => state.coupon);   

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getUserInfo());
            await dispatch(getCouponUser());
        };
        fetchData();
    }, [dispatch]);

    const handleProfile = () => navigate('/profile');
    const handleAddress = () => navigate('/address');
    const handleHistory = () => navigate('/history');

    if (!bio) {
        return <div>No user information available.</div>;
    }

    return (
        <div>
            <Header />
            <div className="bg-slate-100 py-10">
                <div className="px-4 md:px-8 lg:px-48 container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Sidebar */}
                        <div className='md:col-span-1 space-y-8'>
                            <UserNavBar 
                                bio={bio} 
                                handleProfile={handleProfile} 
                                handleAddress={handleAddress} 
                                handleHistory={handleHistory} 
                            />
                        </div>

                        {/* Nội dung chính */}
                        <div className='md:col-span-2 flex flex-col items-center justify-start'>
                            <div className='w-full bg-white rounded-lg shadow-xl flex flex-col py-5 px-10'>
                                <p className='mb-4 text-2xl font-semibold text-center'>MÃ GIẢM GIÁ</p>

                                {/* Danh sách mã giảm giá */}
                                <div className="grid grid-cols-2 gap-4">
                                    {coupons.length > 0 ? (
                                        coupons.map((coupon) => (
                                            <div 
                                                key={coupon.id} 
                                                className="flex justify-center items-center border border-gray-300 rounded-lg p-4 shadow-md bg-white"
                                            >
                                                <img 
                                                    className="w-20 object-cover rounded-md"
                                                    src={coupon.image} 
                                                    alt={coupon.name}
                                                />
                                                <div className='flex flex-col items-start pl-5'>
                                                    <h3 className="text-lg font-semibold text-gray-800 text-center">
                                                        {coupon.name}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm">
                                                        {coupon.description}
                                                    </p>
                                                    <div className="mt-2 text-center text-gray-500 text-xs text-red-600">
                                                        HSD: {coupon.expireDate}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center col-span-full">
                                            Không có mã giảm giá nào
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ListCoupon;

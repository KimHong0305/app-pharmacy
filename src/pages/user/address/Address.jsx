import React, { useEffect } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../../store/Reducers/authReducer';
import { useNavigate } from 'react-router-dom';
import { getAddress, fetchAddressWithLocationNames } from '../../../store/Reducers/addressReducer';
import { IoIosAddCircleOutline } from "react-icons/io";
import UserNavBar from '../../../components/UserNavBar';

const Address = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const address = useSelector((state) => state.address.address);
    const { bio } = useSelector((state) => state.auth);
    const { updateAddress } = useSelector((state) => state.address);

    useEffect(() => {
        const fetchData = async () => {
            await dispatch(getUserInfo());
            await dispatch(getAddress());
        };
        fetchData();
    }, [dispatch]);

    useEffect(() => {
        if (address.length > 0) {
          dispatch(fetchAddressWithLocationNames(address));
        }
    }, [address, dispatch]);
    
    const hanldeEditAddress = (addr) => {
        navigate('/editAddress', { state: addr });
    };

    const handleAddAddress = () => {
        navigate('/addAddress');
    };

    if (!bio) {
        return <div>No user information available.</div>;
    }

    return (
        <div>
            <Header />
            <div className="bg-slate-100 py-10">
                <div className="px-4 md:px-8 lg:px-48 container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <UserNavBar 
                            bio={bio} 
                            handleProfile={() => navigate('/profile')}
                            handleHistory={() => navigate('/history')}
                            handleCoupon={() => navigate('/coupon')}
                        />

                        <div className="md:col-span-2 flex flex-col items-center justify-start">
                            <div className="w-full bg-white rounded-lg shadow-xl flex flex-col items-center justify-center py-5 px-10">
                                <p className="mb-4 text-2xl font-semibold">ĐỊA CHỈ NHẬN HÀNG</p>
                                {updateAddress && updateAddress.length > 0 ? (
                                    <div className="w-full text-left">
                                        {updateAddress.map((addr) => (
                                            <div key={addr.id} className="p-4 cursor-pointer border-b border-gray-300 text-sm text-gray-400 space-y-2"
                                            onClick={() =>hanldeEditAddress(addr)}>
                                                <div className='flex justify-between'>
                                                    <div className='flex'>
                                                        <p className='font-semibold text-black'>
                                                            {addr.fullname}
                                                        </p>
                                                        <div className="ml-2 mr-2 border-r border-gray-300"></div>
                                                        <p>
                                                            (+84) {addr.phone}
                                                        </p>
                                                    </div>
                                                    <p className="w-[90px] px-2 text-center rounded border border-blue-700 text-blue-700">
                                                        {addr.addressCategory === "HOUSE" ? "Nhà riêng" : 
                                                        addr.addressCategory === "COMPANY" ? "Văn phòng" : "Loại khác"}
                                                    </p>
                                                </div>
                                                <p>{addr.address}</p>
                                                <p>{addr.villageName}</p>
                                                {addr.addressDefault && (
                                                    <p className='w-[80px] px-2 text-center rounded border border-red-600 text-red-600'>
                                                        Mặc định
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p>Chưa có thông tin địa chỉ.</p>
                                )}
                                <button className="mt-5 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600" 
                                onClick= {handleAddAddress}>
                                    <div className='flex items-center justify-center'>
                                        <IoIosAddCircleOutline className='mr-1'/>
                                        <p>Thêm địa chỉ mới</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Address;

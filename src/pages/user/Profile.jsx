import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { TbCoinYuanFilled } from "react-icons/tb";
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../store/Reducers/authReducer';
import { HiOutlineUserCircle } from "react-icons/hi2";
import { IoLocationOutline } from "react-icons/io5";
import { PiNewspaperClippingLight } from "react-icons/pi";
import { updateBio } from '../../store/Reducers/userReducer';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Profile = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { bio } = useSelector((state) => state.auth);   
    
    const [imageUpload, setImageUpload] = useState(null);
    const [image, setImage] = useState(null);
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        dispatch(getUserInfo());
    }, [dispatch]);

    useEffect(() => {
        if (bio && bio.dob) {
            const date = bio.dob.split('/');
            if (date.length === 3) {
                setDob(`${date[2]}-${date[1]}-${date[0]}`);
            }
        }
        if (bio && bio.sex) {
            setGender(bio.sex);
        }
        if (bio && bio.phone_number) {
            setPhone(bio.phone_number);
        }

        if (bio && bio.image) {
            setImageUpload(bio.image);
        }
    }, [bio]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageUpload(reader.result);
                setImage(file);
                console.log("Ảnh đã tải lên:", reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenderChange = (e) => {
        const newGender = e.target.value;
        setGender(newGender);
        console.log("Giới tính mới:", newGender);
    };

    const handlePhoneChange = (e) => {
        const newPhone = e.target.value;
        setPhone(newPhone);
        console.log("Số điện thoại mới:", newPhone);
    };

    const handleDobChange = (e) => {
        const newDob = e.target.value;
        setDob(newDob);
        console.log("Ngày sinh mới:", newDob);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formatDate = (date) => {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, "0");
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
        };
    
        const formattedDate = dob ? formatDate(dob) : "";

        const update = {
            id: bio.id,
            dob: formattedDate,
            sex: gender,
            phone_number: phone
        }
        
        const formData = new FormData();

        formData.append("updateUser", new Blob([JSON.stringify(update)], { type: "application/json" }));
        formData.append('file', image);

        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        
        try {
            await dispatch(updateBio(formData)).unwrap();
            toast.success("Cập nhật thông tin thành công!");
            dispatch(getUserInfo());
        } catch (error) {
            toast.error(error.message);
        }
    };  
    
    const hanldeAddress = () => {
        navigate('/address');
    }

    if (!bio) {
        return <div>No user information available.</div>;
    }

    const { username, point } = bio;

    return (
        <div>
            <Header />
            <div className="bg-slate-100 py-10">
            <div className="px-4 md:px-8 lg:px-48 container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className='md:col-span-1 space-y-8'>
                        <div className='w-full bg-white rounded-lg shadow-xl flex flex-col p-5'>
                            <div className='flex items-center justify-start'>
                                <img className='w-[80px] h-[80px] rounded-full border-2 overflow-hidden' src={bio.image} alt="" />
                                <div className='ml-4 flex flex-col items-start'>
                                    <p className='text-lg font-normal'>{username}</p>
                                    <div className='flex items-center justify-center mt-5 '>
                                        <p className='text-lg font-normal mr-2'>Số xu: {point}</p>
                                        <TbCoinYuanFilled className='h-5 w-5 text-orange-500'/>
                                    </div>
                                </div>
                            </div>
                            <div className="my-4 flex-grow border-t border-gray-300"></div>
                            <div className="flex flex-col items-start justify-start space-y-4">
                            <button className="block w-full h-10 flex items-center space-x-2 text-left text-sky-600 bg-sky-100 font-medium">
                                <HiOutlineUserCircle className="text-xl ml-2"/>
                                    <span>Thông tin cá nhân</span>
                                </button>
                                
                                <button className="block w-full h-10 flex items-center space-x-2 text-left text-gray-700 font-medium hover:text-sky-600"
                                onClick={hanldeAddress}>
                                    <IoLocationOutline className="text-xl ml-2"/>
                                    <span>Địa chỉ nhận hàng</span>
                                </button>

                                <button className="block w-full h-10 flex items-center space-x-2 text-left text-gray-700 font-medium hover:text-sky-600">
                                    <PiNewspaperClippingLight className="text-xl ml-2"/>
                                    <span>Lịch sử mua hàng</span>
                                </button>
                            </div>

                        </div>
                    </div>
                    <div className='md:col-span-2 flex flex-col items-center justify-start'>
                        <div className='w-full bg-white rounded-lg shadow-xl flex flex-col items-center justify-center py-5 px-10 divide-y'>
                        <p className='mb-4 text-2xl font-semibold'>THÔNG TIN CÁ NHÂN</p>
                        <form className="w-full" onSubmit={handleSubmit}>
                            <div>
                                <label className="block font-medium text-gray-700 my-2">
                                    Ảnh đại diện
                                </label>
                                <div className="flex items-center">
                                    {/* Hiển thị ảnh đại diện */}
                                    <img
                                        className="w-[80px] h-[80px] rounded-full border-2 object-cover"
                                        src={imageUpload || "https://via.placeholder.com/80"}
                                        alt="Avatar"
                                    />
                                    <div className="flex flex-col items-start justify-center ml-8">
                                    {/* Nút cập nhật ảnh */}
                                    <div className="file-input-container">
                                        <input
                                            type="file"
                                            id="image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <label htmlFor="image"
                                            className="px-4 py-1 font-semibold text-neutral-900 rounded bg-neutral-200 hover:bg-neutral-300">
                                            Cập nhật ảnh
                                        </label>
                                    </div>
                                    <p className="mt-2 text-sm text-neutral-800">
                                        Dung lượng file tối đa 5 MB.
                                    </p>
                                    </div>
                                </div>
                            </div>

                            {/* Ngày sinh */}
                            <div className="mt-4">
                                <label className="block font-medium text-gray-700 mb-2">
                                    Ngày sinh
                                </label>
                                <input
                                    type="date"
                                    value={dob || ""}
                                    onChange={handleDobChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>

                            {/* Giới tính */}
                            <div className="mt-4">
                                <label className="block font-medium text-gray-700 mb-2">
                                    Giới tính
                                </label>
                                <select
                                    value={gender}
                                    onChange={handleGenderChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="Male">Nam</option>
                                    <option value="Female">Nữ</option>
                                    <option value="Other">Khác</option>
                                </select>
                            </div>

                            {/* Số điện thoại */}
                            <div className="mt-4">
                                <label className="block font-medium text-gray-700 mb-2">
                                    Số điện thoại
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>

                            <div className="flex justify-end w-full mt-5">
                                <button className="bg-sky-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-600" 
                                type="submit">
                                    Cập nhật
                                </button>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
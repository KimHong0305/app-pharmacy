import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../store/Reducers/authReducer';
import { updateBio } from '../../store/Reducers/userReducer';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import UserNavBar from "../../components/UserNavBar";

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { bio } = useSelector((state) => state.auth);   
    
    const [imageUpload, setImageUpload] = useState(null);
    const [image, setImage] = useState(null);
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const [lastname, setLastname] = useState('');
    const [firstname, setFirstname] = useState('');

    useEffect(() => {
        dispatch(getUserInfo());
    }, [dispatch]);

    useEffect(() => {
        if (bio) {
            setDob(bio.dob ? formatDateForInput(bio.dob) : '');
            setGender(bio.sex || '');
            setPhone(bio.phoneNumber || '');
            setImageUpload(bio.image || '');
            setFirstname(bio.firstname || '');
            setLastname(bio.lastname || '');
        }
    }, [bio]);

    const formatDateForInput = (date) => {
        const parts = date.split('/');
        return parts.length === 3 ? `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}` : '';
    };

    const formatDateForServer = (date) => {
        const parts = date.split('-');
        return parts.length === 3 ? `${parts[2].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[0]}` : '';
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setImageUpload(reader.result);
            reader.readAsDataURL(file);
            setImage(file);
        }
    };

    const isChanged = () => {
        const originalDob = bio.dob ? formatDateForInput(bio.dob) : '';
        return (
            firstname !== bio.firstname ||
            lastname !== bio.lastname ||
            phone !== bio.phoneNumber ||
            gender !== bio.sex ||
            dob !== originalDob ||
            image !== null
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isChanged()) {
            toast.info("Không có thay đổi nào để cập nhật.");
            return;
        }

        const update = {
            id: bio.id,
            dob: dob ? formatDateForServer(dob) : '',
            sex: gender,
            phoneNumber: phone,
            lastname: lastname,
            firstname: firstname,
        };
        
        const formData = new FormData();
        formData.append("updateUser", new Blob([JSON.stringify(update)], { type: "application/json" }));
        if (image) formData.append('file', image);

        console.log(update)

        try {
            await dispatch(updateBio(formData)).unwrap();
            toast.success("Cập nhật thông tin thành công!");
            dispatch(getUserInfo());
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleAddress = () => navigate('/user/addresses');
    const handleCoupon = () => navigate('/user/coupons');
    const handleHistory = () => navigate('/user/orders/history');

    if (!bio) return <div>No user information available.</div>;

    return (
        <div>
            <Header />
            <div className="bg-slate-100 py-10">
                <div className="px-4 md:px-8 lg:px-48 container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Dùng component sidebar */}
                        <div className='md:col-span-1 space-y-8'>
                            <UserNavBar bio={bio} handleAddress={handleAddress} handleCoupon ={handleCoupon} handleHistory={handleHistory} />
                        </div>

                        <div className='md:col-span-2 flex flex-col items-center justify-start'>
                            <div className='w-full bg-white rounded-lg shadow-xl flex flex-col items-center justify-center py-5 px-10 divide-y'>
                                <p className='mb-4 text-2xl font-semibold'>THÔNG TIN CÁ NHÂN</p>
                                <form className="w-full" onSubmit={handleSubmit}>
                                    <div>
                                        <label className="block font-medium text-gray-700 my-2">Ảnh đại diện</label>
                                        <div className="flex items-center">
                                            <img className="w-[80px] h-[80px] rounded-full border-2 object-cover"
                                                 src={imageUpload || "http://localhost:3000/images/avata_khach.jpg"}
                                                 alt="Avatar" />
                                            <div className="flex flex-col items-start justify-center ml-8">
                                                <div className="file-input-container">
                                                    <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="hidden"/>
                                                    <label htmlFor="image" className="px-4 py-1 font-semibold text-neutral-900 rounded bg-neutral-200 hover:bg-neutral-300">
                                                        Cập nhật ảnh
                                                    </label>
                                                </div>
                                                <p className="mt-2 text-sm text-neutral-800">Dung lượng file tối đa 5 MB.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-center gap-4">
                                        <div className='w-1/2'>
                                            <label className="block font-medium text-gray-700 mb-2">Họ</label>
                                            <input
                                                type="text"
                                                value={lastname}
                                                onChange={(e) => setLastname(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                            />
                                        </div>
                                        <div className='w-1/2'>
                                            <label className="block font-medium text-gray-700 mb-2">Tên</label>
                                            <input
                                                type="text"
                                                value={firstname}
                                                onChange={(e) => setFirstname(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block font-medium text-gray-700 mb-2">Ngày sinh</label>
                                        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)}
                                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block font-medium text-gray-700 mb-2">Giới tính</label>
                                        <select value={gender} onChange={(e) => setGender(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                                            <option value="">Chọn giới tính</option>
                                            <option value="Male">Nam</option>
                                            <option value="Female">Nữ</option>
                                            <option value="Other">Khác</option>
                                        </select>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block font-medium text-gray-700 mb-2">Số điện thoại</label>
                                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                                    </div>

                                    <div className="flex justify-end w-full mt-5">
                                        <button className="bg-sky-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-600" type="submit">
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

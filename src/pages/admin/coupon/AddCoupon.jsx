import React, { useState } from 'react';
import { IoReturnDownBackSharp } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { createCoupon } from '../../../store/Reducers/couponReducer';

const AddCoupon = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [coupon, setCoupon] = useState({
        name: '',
        percent: '',
        max: '',
        orderRequire: '',
        levelUser: '',
        description: '',
        expireDate: '',
        file: null
    });

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCoupon({ ...coupon, [name]: name === 'percent' || name === 'max' || name === 'orderRequire' ? Math.max(0, value) : value });
    };

    const handleImageChange = (e) => {
        setCoupon({ ...coupon, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const [year, month, day] = coupon.expireDate.split('-');
        const formattedExpireDate = `${day}/${month}/${year}`;
    
        const formData = new FormData();
    
        const newCoupon = {
            name: coupon.name,
            percent: coupon.percent,
            max: coupon.max,
            orderRequire: coupon.orderRequire,
            levelUser: coupon.levelUser,
            description: coupon.description,
            expireDate: formattedExpireDate,
        };
        
        formData.append("createCoupon", new Blob([JSON.stringify(newCoupon)], { type: "application/json" }));
        
        formData.append("file", coupon.file);
    
        console.log(formData)

        try {
            await dispatch(createCoupon(formData)).unwrap();
            toast.success('Tạo mã giảm giá thành công!');
            navigate(-1);
        } catch (error) {
            toast.error(error.message || 'Đã có lỗi xảy ra!');
        }

    };
    

    return (
        <div className="px-2 md:px-4">
            <div className="p-4 rounded bg-white shadow-lg">
                <div className="min-h-96">
                    <span onClick={handleGoBack} className="inline-block cursor-pointer">
                        <IoReturnDownBackSharp className="inline-block" />
                        <button className="inline-block ml-5">Quay lại</button>
                    </span>
                    <div className='py-5'>
                        <h2 className="text-center text-2xl font-bold mb-2">Thêm mã giảm giá</h2>
                        <div className='px-4 md:px-32 lg:px-64'>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="font-medium text-gray-700">Tên mã giảm giá</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={coupon.name}
                                        onChange={handleChange}
                                        className="mt-2 border border-gray-300 rounded-lg w-full p-2"
                                        placeholder="Nhập tên mã giảm giá"
                                    />
                                </div>

                                <div>
                                    <label className="font-medium text-gray-700">Phần trăm giảm (%)</label>
                                    <input
                                        type="number"
                                        name="percent"
                                        value={coupon.percent}
                                        onChange={handleChange}
                                        className="mt-2 border border-gray-300 rounded-lg w-full p-2"
                                        placeholder="Nhập phần trăm giảm giá"
                                    />
                                </div>

                                <div>
                                    <label className="font-medium text-gray-700">Giảm tối đa (vnđ)</label>
                                    <input
                                        type="number"
                                        name="max"
                                        value={coupon.max}
                                        onChange={handleChange}
                                        className="mt-2 border border-gray-300 rounded-lg w-full p-2"
                                        placeholder="Nhập số tiền giảm tối đa"
                                    />
                                </div>

                                <div>
                                    <label className="font-medium text-gray-700">Giá trị đơn hàng tối thiểu (vnđ)</label>
                                    <input
                                        type="number"
                                        name="orderRequire"
                                        value={coupon.orderRequire}
                                        onChange={handleChange}
                                        className="mt-2 border border-gray-300 rounded-lg w-full p-2"
                                        placeholder="Nhập giá trị đơn hàng tối thiểu"
                                    />
                                </div>

                                <div>
                                    <label className="font-medium text-gray-700">Hạng người dùng</label>
                                    <select
                                        name="levelUser"
                                        value={coupon.levelUser}
                                        onChange={handleChange}
                                        className="mt-2 border border-gray-300 rounded-lg w-full p-2"
                                    >
                                        <option value="">Chọn hạng</option>
                                        <option value="DONG">ĐỒNG</option>
                                        <option value="BAC">BẠC</option>
                                        <option value="VANG">VÀNG</option>
                                        <option value="BACHKIM">BẠCH KIM</option>
                                        <option value="KIMCUONG">KIM CƯƠNG</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="font-medium text-gray-700">Mô tả</label>
                                    <textarea
                                        name="description"
                                        value={coupon.description}
                                        onChange={handleChange}
                                        className="mt-2 border border-gray-300 rounded-lg w-full p-2"
                                        placeholder="Nhập mô tả"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="font-medium text-gray-700">Ngày hết hạn</label>
                                    <input
                                        type="date"
                                        name="expireDate"
                                        value={coupon.expireDate}
                                        onChange={handleChange}
                                        className="mt-2 border border-gray-300 rounded-lg w-full p-2"
                                    />
                                </div>

                                <div>
                                    <label className="font-medium text-gray-700">Ảnh minh họa</label>
                                    <input
                                        type="file"
                                        onChange={handleImageChange}
                                        className="mt-2 border border-gray-300 rounded-lg w-full p-2"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                                >
                                    Tạo mã giảm giá
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCoupon;

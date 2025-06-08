import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { IoReturnDownBackSharp } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { updateCompany } from '../../../store/Reducers/companyReducer';

const EditCompany = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const company = location.state;

    const [companyName, setCompanyName] = useState(company.name);
    const [origin, setOrigin] = useState(company.origin);
    const [imagePreview, setImagePreview] = useState(company.image);
    const [image, setImage] = useState(null);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const companyData = {
        id: company.id,
        name: companyName,
        origin,
        };

        const formData = new FormData();
            formData.append("updateCompany", new Blob([JSON.stringify(companyData)], { type: "application/json" }));
        if (image) {
            formData.append("files", image);
        }

        try {
            dispatch(updateCompany(formData)).unwrap();
            toast.success("Cập nhật công ty thành công");
            navigate(-1);
        } catch (error) {
            toast.error("Lỗi khi cập nhật công ty");
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
            setImage(file);
        } else {
            setImage(null);
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

                <div className="py-5">
                    <h2 className="text-center text-2xl font-bold mb-4">Chỉnh sửa thông tin công ty</h2>

                    <div className="px-10 md:px-40">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                            <label htmlFor="companyName" className="font-medium text-gray-700">Tên công ty</label>
                            <input
                                type="text"
                                id="companyName"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md"
                                placeholder="Nhập tên công ty"
                                required
                            />
                            </div>

                            <div>
                            <label htmlFor="origin" className="font-medium text-gray-700">Xuất xứ</label>
                            <input
                                type="text"
                                id="origin"
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md"
                                placeholder="Nhập quốc gia"
                                required
                            />
                            </div>

                            {/* Upload hình ảnh */}
                            <div>
                            <label className="font-medium text-gray-700">Logo công ty</label>
                            <div className="mt-2">
                                <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                />
                                <label
                                htmlFor="image"
                                className="flex items-center justify-center w-[300px] h-[150px] border-dashed border-2 border-gray-300 cursor-pointer"
                                >
                                {imagePreview ? (
                                    <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="object-cover w-[300px] h-[140px]"
                                    />
                                ) : (
                                    <IoIosAddCircleOutline className="text-gray-300 text-4xl" />
                                )}
                                </label>
                            </div>
                            </div>

                            <button
                            type="submit"
                            className="w-full bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-sky-600"
                            >
                            Cập nhật công ty
                            </button>
                        </form>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default EditCompany;

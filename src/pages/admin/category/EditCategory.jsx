import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from "react-router-dom";
import { IoReturnDownBackSharp } from "react-icons/io5";
import { IoIosAddCircleOutline } from "react-icons/io";
import { updateCategory } from '../../../store/Reducers/categoryReducer';


const EditCategory = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { allCategory } = useSelector((state) => state.category);
    const category = location.state;

    const [categoryName, setCatoryName] = useState(category.name);
    const [selectedParent, setSelectedParent] = useState(category.parent?.id || "Không có");
    const [imagePreview, setimagePreview] = useState(category.image);
    const [image, setimage] = useState(null)

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let categoryData;

        if (selectedParent === 'null') {
            categoryData = {
                id: category.id,
                name: categoryName,
            };
        } else {
            categoryData = {
                id: category.id,
                name: categoryName,
                parent: selectedParent,
            };
        }

        console.log('data',categoryData)
        const formData = new FormData();
        formData.append("updateCategory", new Blob([JSON.stringify(categoryData)], { type: "application/json" }));
        formData.append('file', image);

        try {
            await dispatch(updateCategory(formData)).unwrap();
            toast.success('Cập nhật danh mục thành công')
            navigate(-1);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setimagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setimage(file);
        } else {
            setimage(null);
        }
    };   

    return (
        <div className="px-2 md:px-4">
            <div className="p-4 rounded bg-white shadow-lg">
                <div className="min-h-96">
                    <span onClick={handleGoBack} className="inline-block">
                        <IoReturnDownBackSharp className="cursor-pointer inline-block"/>
                        <button className="inline-block ml-5">Quay lại</button>
                    </span>
                    <div className='py-5'>
                        <h2 className="text-center text-2xl font-bold mb-2">Sửa danh mục</h2>
                        <div className='px-16 md:px-56 lg:px-80'>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Tên danh mục */}
                                <div>
                                    <label htmlFor="categoryName" className="font-medium text-gray-700">Tên danh mục</label>
                                    <input
                                        type="text"
                                        id="categoryName"
                                        value={categoryName}
                                        onChange={(e) => setCatoryName(e.target.value)}
                                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md"
                                        placeholder="Nhập tên danh mục"
                                        required
                                    />
                                </div>

                                {/* Danh mục cha*/}
                                <div>
                                    <label htmlFor="parentName" className="font-medium text-gray-700">Danh mục cha</label>
                                    <select 
                                        id="parentName" 
                                        value={selectedParent}
                                        className="mt-2 h-12 border border-gray-300 text-gray-700 text-base rounded-lg block w-full py-2.5 px-4 focus:outline-none"
                                        onChange={(e) => setSelectedParent(e.target.value)}
                                    >
                                        <option value="null" className="font-semibold">Không có</option>
                                        {allCategory.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tải hình ảnh */}
                                <div>
                                    <label className="block font-medium text-gray-700">Hình ảnh</label>
                                    <div className="mt-2">
                                        <div className="file-input-container">
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
                                                    alt="image Preview"
                                                    className="object-cover w-[300px] h-[140px]"
                                                />
                                                ) : (
                                                <IoIosAddCircleOutline className="text-gray-300 text-4xl" />
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                
                                <button
                                    type="submit"
                                    className="w-full bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-sky-500"
                                >
                                    Cập nhật
                                </button>
                                    
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCategory;
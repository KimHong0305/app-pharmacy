import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoReturnDownBackSharp } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import { getCompanies } from '../../../store/Reducers/companyReducer';
import { getAllCategory } from '../../../store/Reducers/categoryReducer';
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import { createProduct } from '../../../store/Reducers/productReducer';
import { toast } from 'react-toastify';

const AddProduct = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [company, setCompany] = useState('');
    const [benefits, setBenefits] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [constraindication, setConstraindication] = useState('');
    const [object_use, setObject_use] = useState('');
    const [instruction, setInstruction] = useState('');
    const [preserve, setPreserve] = useState('');
    const [note, setNote] = useState('');
    const [dateExpiration, setDateExpiration] = useState('');
    const [doctor_advice, setDoctor_advice] = useState(false);
    const [images, setImages] = useState([])

    const handleGoBack = () => {
        navigate(-1);
    };

    const { allCategory } = useSelector((state) => state.category);
    const { companies } = useSelector((state) => state.company);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages((prevImages) => [...prevImages, reader.result]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDeleteImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };
    


    useEffect(() => {
        dispatch(getCompanies({ page: 0, size: 100 }));
        dispatch(getAllCategory({ page: 0, size: 100 }));
    }, [dispatch]);

    const handleToggle = () => {
        setDoctor_advice(!doctor_advice);
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
          
        const formattedDateExpiration = dateExpiration
        ? formatDate(dateExpiration)
        : "";
        

        const newProduct = {
            name: productName,
            quantity: quantity,
            categoryId: categoryName,
            companyId: company,
            benefits: benefits.replace(/\n/g, "\\n"),
            ingredients: ingredients.replace(/\n/g, "\\n"),
            constraindication: constraindication.replace(/\n/g, "\\n"),
            object_use: object_use.replace(/\n/g, "\\n"),
            instruction: instruction.replace(/\n/g, "\\n"),
            preserve: preserve.replace(/\n/g, "\\n"),
            note: note.replace(/\n/g, "\\n"),
            dateExpiration: formattedDateExpiration,
            doctor_advice: doctor_advice,
        };
    
        const formData = new FormData();

        formData.append("createProduct", new Blob([JSON.stringify(newProduct)], { type: "application/json" }));
    
        images.forEach((image, index) => {
            const byteString = atob(image.split(",")[1]);
            const mimeString = image.split(",")[0].split(":")[1].split(";")[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
        
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
        
            const blob = new Blob([ab], { type: mimeString });
            formData.append("listImages", blob, `image${index + 1}.jpg`);
        });        

        console.log("Dữ liệu FormData:");
        for (let [key, value] of formData.entries()) {
            if (value instanceof Blob) {
                console.log(key, value.name, value.type);
            } else {
                console.log(key, value);
            }
        }

        try {
            await dispatch(createProduct(formData)).unwrap();
            toast.success('Thêm sản phẩm thành công')
            navigate(-1);
        } catch (error) {
            toast.error(error.message);
        }
    };
    

    return (
        <div className="px-2 md:px-4">
            <div className="p-4 rounded bg-white shadow-lg">
                <div className="min-h-96">
                    <span onClick={handleGoBack} className="inline-block">
                        <IoReturnDownBackSharp className="inline-block"/>
                        <button className="inline-block ml-5">Quay lại</button>
                    </span>
                    <div className='py-5'>
                        <h2 className="text-center text-2xl font-bold mb-2">Thêm sản phẩm</h2>
                        <div className='px-16 md:px-32 lg:px-48'>
                            <form onSubmit={handleSubmit}>
                                
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-10 pb-5'>
                                    <div className='md:col-span-2'>
                                        {/* Tên sản phẩm */}
                                        <label htmlFor="productName" className="font-medium text-gray-700">
                                            Tên sản phẩm <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="productName"
                                            value={productName}
                                            onChange={(e) => setProductName(e.target.value)}
                                            className="mt-2 mb-5 w-full px-4 py-2 border border-gray-300 rounded-md"
                                            placeholder="Nhập tên sản phẩm"
                                            required
                                        />

                                        {/* Danh mục*/}
                                        <label htmlFor="categoryName" className="font-medium text-gray-700">
                                            Danh mục <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <select 
                                            id="categoryName" 
                                            className="mt-2 h-12 border border-gray-300 text-gray-700 text-base rounded-lg block w-full py-2.5 px-4 focus:outline-none"
                                            onChange={(e) => setCategoryName(e.target.value)}
                                        >
                                            <option value="" disabled selected>Chọn danh mục</option>
                                            {allCategory.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>

                                    </div>

                                    <div className='md:col-span-1'>
                                        {/* Số lượng */}
                                        <label htmlFor="quantity" className="font-medium text-gray-700">
                                            Số lượng <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="quantity"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            className="mt-2 mb-5 w-full px-4 py-2 border border-gray-300 rounded-md"
                                            placeholder="Nhập số lượng"
                                            required
                                        />

                                        {/* Công ty*/}
                                        <label htmlFor="company" className="font-medium text-gray-700">
                                            Công ty <span className="text-red-500 ml-1">*</span>
                                        </label>
                                        <select 
                                            id="company" 
                                            className="mt-2 h-12 border border-gray-300 text-gray-700 text-base rounded-lg block w-full py-2.5 px-4 focus:outline-none"
                                            onChange={(e) => setCompany(e.target.value)}
                                        >
                                            <option value="" disabled selected>Chọn công ty</option>
                                            {companies.map((company) => (
                                                <option key={company.id} value={company.id}>
                                                    {company.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Công dụng */}
                                <label htmlFor="benefits" className="font-medium text-gray-700">
                                    Công dụng <span className="text-red-500 ml-1">*</span>
                                </label>
                                <textarea
                                    type="text"
                                    id="benefits"
                                    value={benefits}
                                    onChange={(e) => setBenefits(e.target.value)}
                                    className="mt-2 mb-5 w-full px-4 py-2 border border-gray-300 rounded-md"
                                    placeholder="Nhập công dụng của sản phẩm"
                                    required
                                />

                                {/* Thành phần */}
                                <label htmlFor="ingredients" className="font-medium text-gray-700">
                                    Thành phần <span className="text-red-500 ml-1">*</span>
                                </label>
                                <textarea
                                    type="text"
                                    id="ingredients"
                                    value={ingredients}
                                    onChange={(e) => setIngredients(e.target.value)}
                                    className="mt-2 mb-5 w-full px-4 py-2 border border-gray-300 rounded-md"
                                    placeholder="Nhập thành phần của sản phẩm"
                                />

                                {/* Chống chỉ định */}
                                <label htmlFor="constraindication" className="font-medium text-gray-700">
                                    Chống chỉ định <span className="text-red-500 ml-1">*</span>
                                </label>
                                <textarea
                                    type="text"
                                    id="constraindication"
                                    value={constraindication}
                                    onChange={(e) => setConstraindication(e.target.value)}
                                    className="mt-2 mb-5 w-full px-4 py-2 border border-gray-300 rounded-md"
                                    placeholder="Nhập chống chỉ định"
                                />

                                {/* Đối tượng sử dụng */}
                                <label htmlFor="object_use" className="font-medium text-gray-700">
                                    Đối tượng sử dụng <span className="text-red-500 ml-1">*</span>
                                </label>
                                <textarea
                                    type="text"
                                    id="object_use"
                                    value={object_use}
                                    onChange={(e) => setObject_use(e.target.value)}
                                    className="mt-2 mb-5 w-full px-4 py-2 border border-gray-300 rounded-md"
                                    placeholder="Nhập đối tượng sử dụng"
                                />

                                {/* Hướng dẫn sử dụng */}
                                <label htmlFor="instruction" className="font-medium text-gray-700">
                                    Hướng dẫn sử dụng <span className="text-red-500 ml-1">*</span>
                                </label>
                                <textarea
                                    type="text"
                                    id="instruction"
                                    value={instruction}
                                    onChange={(e) => setInstruction(e.target.value)}
                                    className="mt-2 mb-5 w-full px-4 py-2 border border-gray-300 rounded-md"
                                    placeholder="Nhập hướng dẫn sử dụng"
                                />

                                {/* Bảo quản */}
                                <label htmlFor="preserve" className="font-medium text-gray-700">
                                    Bảo quản <span className="text-red-500 ml-1">*</span>
                                </label>
                                <textarea
                                    type="text"
                                    id="preserve"
                                    value={preserve}
                                    onChange={(e) => setPreserve(e.target.value)}
                                    className="mt-2 mb-5 w-full px-4 py-2 border border-gray-300 rounded-md"
                                    placeholder="Nhập bảo quản"
                                />

                                {/* Lưu ý */}
                                <label htmlFor="note" className="font-medium text-gray-700">Lưu ý</label>
                                <textarea
                                    type="text"
                                    id="note"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="mt-2 mb-5 w-full px-4 py-2 border border-gray-300 rounded-md"
                                    placeholder="Nhập lưu ý"
                                />

                                {/* Hạn sử dụng */}
                                <label htmlFor="dateExpiration" className="font-medium text-gray-700">
                                    Hạn sử dụng <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="dateExpiration"
                                    name="dateExpiration"
                                    value={dateExpiration}
                                    onChange={(e) => setDateExpiration(e.target.value)}
                                    className="mt-2 mb-5 w-full px-4 py-2 border border-gray-300 rounded-md"
                                />

                                {/* Lời khuyên bác sĩ */}
                                <div className='flex'>
                                    <div 
                                        className={`relative inline-flex items-center h-6 w-12 cursor-pointer rounded-full 
                                            ${doctor_advice ? 'bg-green-500' : 'bg-gray-300'}`}
                                        onClick={handleToggle}
                                    >
                                        <span 
                                            className={`absolute left-0.5 h-5 w-5 transform rounded-full bg-white shadow transition-all 
                                                ${doctor_advice? 'translate-x-6' : ''}`}
                                        ></span>
                                    </div>
                                    <p className='ml-2 font-medium text-gray-700'>Cần lời khuyên của bác sĩ</p>
                                </div>

                                {/* Tải hình ảnh */}
                                <div className='mt-5'>
                                    <label className="font-medium text-gray-700">
                                        Hình ảnh <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="mt-2 flex items-center">
                                        {/* Nút tải ảnh */}
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
                                                className="flex items-center justify-center w-[200px] h-[200px] border-dashed border-2 border-gray-300 cursor-pointer"
                                            >
                                                <IoIosAddCircleOutline className="text-gray-300 text-4xl" />
                                            </label>
                                        </div>
                                        {/* Hiển thị danh sách ảnh */}
                                        <div className="flex flex-wrap ml-4 gap-4">
                                            {images && images.map((image, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={image}
                                                        alt={`Uploaded ${index}`}
                                                        className="w-[200px] h-[200px] object-cover border rounded"
                                                    />
                                                    {/* Nút xóa */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteImage(index)}
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 
                                                            opacity-0 opacity-100 transition-opacity"
                                                    >
                                                        <IoCloseSharp/>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

            
                                <div className='flex items-center justify-end'>
                                    <button
                                        type="submit"
                                        className="my-5 w-[150px] md:w-[250px] bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                                    >
                                        Thêm
                                    </button>  
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
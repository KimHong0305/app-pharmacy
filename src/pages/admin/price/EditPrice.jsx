import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoReturnDownBackSharp } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updatePrice } from "../../../store/Reducers/priceReducer";

const EditPrice = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const price = location.state;

    const [productName, setProductName] = useState(price.product.name);
    const [priceValue, setPrice] = useState(price.price);
    const [unitName, setUnitName] = useState(price.unit.name);
    const [quantity, setQuantity] = useState(price.quantity || 0);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleInputChange = (e) => {
        let value = e.target.value.replace(/[^\d]/g, "");
        value = new Intl.NumberFormat("vi-VN").format(value);
        setPrice(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const cleanPrice = String(priceValue).replace(/\./g, "");

        const editPrice = {
            priceId: price.id,
            productId: price.product.id,
            price: parseInt(cleanPrice, 10),
            quantity: quantity,
        };

        console.log("Cập nhật giá:", editPrice)
        
        try {
            await dispatch(updatePrice(editPrice)).unwrap();
            toast.success('Chỉnh sửa giá thành công!')
            navigate(-1);
          } catch (error) {
            toast.error(error.message);
          }
    };

    return (
        <div className="px-2 md:px-4">
            <div className="p-4 rounded bg-white shadow-lg">
                <div className="min-h-96 mb-5">
                    <span onClick={handleGoBack} className="inline-block">
                        <IoReturnDownBackSharp className="inline-block"/>
                        <button className="inline-block ml-5">Quay lại</button>
                    </span>
                    <h2 className="text-center text-2xl font-bold mb-2 mt-5">Chỉnh sửa giá sản phẩm</h2>
                    <div className='px-16 md:px-56 lg:px-80'>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="mb-4">
                                <label className="block font-semibold mb-2">Sản phẩm:</label>
                                <input
                                    type="text"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    className="w-full border border-gray-300 text-gray-600 rounded-md p-2"
                                    readOnly
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block font-semibold mb-2">Đơn vị:</label>
                                <input
                                    type="text"
                                    value={unitName}
                                    onChange={(e) => setUnitName(e.target.value)}
                                    className="w-full border border-gray-300 text-gray-600 rounded-md p-2"
                                    readOnly
                                />
                            </div>

                            <div className='flex items-center border border-gray-300 rounded-md px-3 py-2 w-full'>
                                <input
                                    type="text"
                                    id="price"
                                    value={priceValue}
                                    onChange={handleInputChange}
                                    className="flex-1 bg-transparent focus:outline-none text-gray-900 placeholder-gray-500 w-0"
                                    placeholder="Nhập giá"
                                />
                                <span className="text-gray-500 ml-1">đ</span>
                            </div>

                            <div className="mb-4">
                                <label className="block font-semibold mb-2">Số lượng:</label>
                                <input
                                    type="number"
                                    min={0}
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
                                    className="w-full border border-gray-300 rounded-md p-2 text-gray-900"
                                    placeholder="Nhập số lượng"
                                />
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
    );
};

export default EditPrice;

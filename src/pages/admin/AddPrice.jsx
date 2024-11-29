import React, { useState } from 'react';
import { IoReturnDownBackSharp } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';

const AddPrice = () => {

    const [productName, setProductName] = useState('');
    const { allProducts } = useSelector((state) => state.product);

    console.log(allProducts)

    const handleGoBack = () => {
        window.history.back();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Thêm giá')
    }

    return (
        <div className="px-2 md:px-4">
            <div className="p-4 rounded bg-white shadow-lg">
                <div className="min-h-96">
                    <span onClick={handleGoBack} className="inline-block">
                        <IoReturnDownBackSharp className="inline-block"/>
                        <button className="inline-block ml-5">Quay lại trang quản lý giá</button>
                    </span>
                    <div className='py-5'>
                        <h2 className="text-center text-2xl font-bold mb-2">Thêm giá sản phẩm</h2>
                        <div className='px-16 md:px-56 lg:px-80'>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Tên công ty */}
                                <div>
                                    <label htmlFor="productName" className="font-medium text-gray-700">Tên sản phẩm</label>
                                    <select 
                                        id="productName" 
                                        className="mt-2 h-12 border border-gray-300 text-gray-600 text-base rounded-lg block w-full py-2.5 px-4 focus:outline-none"
                                    >
                                        <option value="" disabled selected>Chọn sản phẩm</option>
                                        {allProducts.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPrice;
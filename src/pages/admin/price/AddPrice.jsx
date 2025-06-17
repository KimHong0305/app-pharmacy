import React, { useState, useEffect } from 'react';
import { IoReturnDownBackSharp } from "react-icons/io5";
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createPrice } from "../../../store/Reducers/priceReducer";
import { useNavigate } from "react-router-dom";
import { getUnits } from "../../../store/Reducers/unitReducer";
import { getAllProducts } from '../../../store/Reducers/productReducer';

const AddPrice = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [price, setPrice] = useState('');
    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedUnit, setSelectedUnit] = useState("");
    const [quantity, setQuantity] = useState('');

    const { allProducts } = useSelector((state) => state.product);
    const { units } = useSelector((state) => state.unit);

    const page = 0;
    const size = 1000;
    useEffect(() => {
        dispatch(getAllProducts({ page, size }));
        dispatch(getUnits({ page, size }));
    }, [dispatch]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const cleanPrice = price.replace(/\./g, "");
    
        if (!selectedProduct || !selectedUnit || !cleanPrice|| !quantity) {
          toast.error("Vui lòng điền đầy đủ thông tin!");
          return;
        }
    
        const newPrice = {
            productId: selectedProduct,
            unitId: selectedUnit,
            price: parseInt(cleanPrice, 10),
           quantity: parseInt(quantity, 10)
        };

        console.log(newPrice)
    
        try {
            await dispatch(createPrice(newPrice)).unwrap();
            toast.success('Thêm giá thành công!')
            navigate(-1);
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleInputChange = (e) => {
        let value = e.target.value.replace(/[^\d]/g, "");
        value = new Intl.NumberFormat("vi-VN").format(value);
        setPrice(value);
    };

    //const cleanPrice = price.replace(/\./g, '');


    return (
        <div className="px-2 md:px-4">
            <div className="p-4 rounded bg-white shadow-lg">
                <div className="min-h-96">
                    <span onClick={handleGoBack} className="inline-block">
                        <IoReturnDownBackSharp className="inline-block"/>
                        <button className="inline-block ml-5">Quay lại</button>
                    </span>
                    <div className='py-5'>
                        <h2 className="text-center text-2xl font-bold mb-2">Thêm giá sản phẩm</h2>
                        <div className='px-16 md:px-56 lg:px-80'>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Tên sản phẩm */}
                                <div>
                                    <label htmlFor="productName" className="font-medium text-gray-700">Sản phẩm</label>
                                    <select 
                                        id="productName" 
                                        className="mt-2 h-12 border border-gray-300 text-gray-600 text-base rounded-lg block w-full py-2.5 px-4 focus:outline-none"
                                        onChange={(e) => setSelectedProduct(e.target.value)}
                                    >
                                        <option value="" disabled selected>Chọn sản phẩm</option>
                                        {allProducts.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tên đơn vị*/}
                                <div>
                                    <label htmlFor="unitName" className="font-medium text-gray-700">Đơn vị</label>
                                    <select 
                                        id="unitName" 
                                        className="mt-2 h-12 border border-gray-300 text-gray-600 text-base rounded-lg block w-full py-2.5 px-4 focus:outline-none"
                                        onChange={(e) => setSelectedUnit(e.target.value)}
                                    >
                                        <option value="" disabled selected>Chọn đơn vị</option>
                                        {units.map((unit) => (
                                            <option key={unit.id} value={unit.id}>
                                                {unit.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Giá */}
                                <div className="flex flex-col items-start justify-center">
                                    <label htmlFor="price" className="font-semibold mb-2">Giá</label>
                                    <div className='flex items-center border border-gray-300 rounded-md px-3 py-2 w-full'>
                                        <input
                                            type="text"
                                            id="price"
                                            value={price}
                                            onChange={handleInputChange}
                                            className="flex-1 bg-transparent focus:outline-none text-gray-900 placeholder-gray-500 w-0"
                                            placeholder="Nhập giá"
                                        />
                                        <span className="text-gray-500 ml-1">đ</span>
                                    </div>
                                </div>

                                {/* Số lượng */}
                                <div className="flex flex-col items-start justify-center">
                                    <label htmlFor="quantity" className="font-semibold mb-2">Số lượng</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                        placeholder="Nhập số lượng"
                                        min={1}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                                >
                                    Thêm
                                </button>    
                                    
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPrice;
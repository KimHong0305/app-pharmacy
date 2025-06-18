import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllPrices } from '../../../store/Reducers/priceReducer';
import { useDispatch } from 'react-redux';
import { IoReturnDownBackSharp } from "react-icons/io5";

const SplitUnit = () => {
    const location = useLocation();
    const products = location.state?.products || [];
    // const products = [
    // {
    //     product: {
    //         id: "1a4ef6c4-c2d3-4ac9-9786-c44f0ab0bb17",
    //         name: "Bơm tiêm sử dụng một lần VINAHANKOOK 3ml/cc"
    //     }
    // }
    // ];

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [productDetails, setProductDetails] = useState([]);

    useEffect(() => {
        const fetchAllUnits = async () => {
            try {
                const res = await dispatch(getAllPrices({ page: 0, size: 1000 })).unwrap();
                const allPrices = res.content;

                const mappedDetails = products.map((p) => {
                    const units = allPrices
                        .filter(price => price.product.id === p.product.id)
                        .sort((a, b) => b.quantity - a.quantity);

                    return {
                        name: p.product.name,
                        productId: p.product.id,
                        units: units.map(unit => ({
                            name: unit.unit.name,
                            quantity: unit.quantity
                        }))
                    };
                });

                setProductDetails(mappedDetails);
            } catch (err) {
                console.error('Lỗi khi lấy dữ liệu getAllPrice:', err);
            }
        };

        if (products.length) {
            fetchAllUnits();
        }
    }, [products]);

    if (!products.length) {
        return (
            <div className="text-center mt-10 text-red-600">
                Không có dữ liệu sản phẩm để hiển thị.
                <button onClick={() => navigate(-1)} className="text-blue-600 block mt-2 underline">Quay lại</button>
            </div>
        );
    }

    if (!productDetails.length) {
        return <p className="text-center mt-10">Đang tải dữ liệu sản phẩm...</p>;
    }

    const handleGoBack = () => {
        navigate(-1);
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
                        <h2 className="text-center text-2xl font-bold mb-5">Thông tin số lượng sản phẩm</h2>

                        {productDetails.map((product, index) => (
                            <>
                            <div key={index} className="mb-2 flex flex-col items-start px-6">
                                <p className="font-semibold text-gray-800 mb-3">{product.name}</p>

                                <table className="w-full table-auto text-left text-sm">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2">Đơn vị</th>
                                            <th className="px-4 py-2">Số lượng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {product.units.map((unit, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="px-4 py-2">{unit.name}</td>
                                                <td className="px-4 py-2">{unit.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SplitUnit;

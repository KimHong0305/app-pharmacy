import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTopCompanies } from '../../store/Reducers/companyReducer';

const TopCompany = () => {
    const dispatch = useDispatch();
    const { topCompanies } = useSelector((state) => state.company);

    useEffect(() => {
        dispatch(getTopCompanies());
    }, [dispatch]);

    return (
        <div>
            <div className='my-10'>
            <p className="text-xl uppercase font-semibold my-2">Thương hiệu nổi bật</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {topCompanies && topCompanies.length > 0 ? (
                    topCompanies.map((brand) => (
                        <div
                            key={brand.id}
                            className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col items-center p-4 hover:shadow-lg transition-shadow duration-200"
                        >
                            <img
                                src={brand.image}
                                alt={brand.name}
                                className="w-42 h-24 object-cover mb-4"
                            />
                            <h2 className="text-lg font-medium">{brand.name}</h2>
                        </div>
                    ))
                ) : (
                    <p className="text-center col-span-4 text-gray-600">Không có dữ liệu để hiển thị.</p>
                )}
            </div>
            </div>
        </div>
    );
};

export default TopCompany;

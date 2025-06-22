import React, { useEffect, useState, useRef } from 'react';
import { MdCurrencyExchange,MdProductionQuantityLimits } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6"; 
import { useDispatch, useSelector } from 'react-redux';
import { getTotalCategory, getTotalCompany, getTotalProduct, getTotalUser } from '../../store/Reducers/dashboardReducer';
import { getStatisticMonthForAdmin, getStatisticYearForAdmin } from '../../store/Reducers/statisticReducer';
import { AiOutlineInfoCircle } from "react-icons/ai";
import ReactApexChart from 'react-apexcharts';
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { getAllPrices } from '../../store/Reducers/priceReducer';

const AdminDashboard = () => {

    const dispatch = useDispatch()
    const {totalUser, totalCompany, totalProduct, totalCategory} = useSelector(state=> state.dashboard)
    const { prices, loading} = useSelector((state) => state.price);

    useEffect(() => {
        dispatch(getTotalUser());
        dispatch(getTotalCompany());
        dispatch(getTotalProduct());
        dispatch(getTotalCategory());

    }, [dispatch])

    const navigate = useNavigate();

    const { dataYear, dataMonth } = useSelector((state) => state.statistic);
    const [selectedMonthInfo, setSelectedMonthInfo] = useState(null);
    const moneyArrayRef = useRef(Array(12).fill(0));
    const [showDetail, setShowDetail] = useState(false);

    const isLowStock = (quantity) => {
        return quantity <= 10;
    };

    const isExpiringSoon = (expirationDate) => {
        const now = new Date();
        const expiry = new Date(expirationDate);
        const timeDiff = expiry - now;
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
        return daysDiff <= 120;
    };

    const lowStockList = prices.filter((price) => {
        const meetsLowStock = isLowStock(price.quantity);
        return meetsLowStock;
    });

    const nearExpiryList = prices.filter((price) => {
        const meetsExpiring = isExpiringSoon(price.dateExpiration);
        return meetsExpiring;
    });

    const [chartData, setChartData] = useState({
        series: [
            {
                name: 'Số tiền chi',
                type: 'column',
                data: Array(12).fill(0)
            },
            {
                name: 'Số đơn',
                type: 'line',
                data: Array(12).fill(0)
            }
        ],
        options: {
            chart: {
                    height: 350,
                    type: 'line',
                    events: {
                        dataPointSelection: (event, chartContext, config) => {
                            const monthIndex = config.dataPointIndex;
                            const money = moneyArrayRef.current[monthIndex];
                            setSelectedMonthInfo({ month: monthIndex + 1, money });
                            dispatch(getStatisticMonthForAdmin({ month: monthIndex + 1, year: 2025 }));
                        }
                    }
            },
            stroke: { width: [0, 4] },
            title: { text: '2025' },
            dataLabels: { enabled: false },
            labels: [
                'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
            ],
            yaxis: [
                { title: { text: 'Money' } },
                { opposite: true, title: { text: 'Order' } }
            ]
        }
    });

    useEffect(() => {
        dispatch(getStatisticYearForAdmin(2025));
        dispatch(getAllPrices({ page: 0, size: 1000 }));
    }, [dispatch]);

    useEffect(() => {
        const moneyData = Array(12).fill(0);
        const orderData = Array(12).fill(0);

        dataYear?.forEach(item => {
            const monthIndex = item.month - 1;
            if (monthIndex >= 0 && monthIndex < 12) {
                moneyData[monthIndex] = item.money;
                orderData[monthIndex] = item.order || 0;
            }
        });

        moneyArrayRef.current = moneyData;

        setChartData(prev => ({
            ...prev,
            series: [
                { ...prev.series[0], data: moneyData },
                { ...prev.series[1], data: orderData }
            ]
        }));
    }, [dataYear]);

    return (
        <div className="px-2 md:px-7 py-5">
            {/* Grid thống kê tổng */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7">
                {[
                {
                    value: totalUser,
                    label: "Total Users",
                    icon: <MdCurrencyExchange />,
                    bg: "#fa0305",
                    cardBg: "#fae8e8",
                },
                {
                    value: totalCompany,
                    label: "Companies",
                    icon: <MdProductionQuantityLimits />,
                    bg: "#760077",
                    cardBg: "#fde2ff",
                },
                {
                    value: totalProduct,
                    label: "Products",
                    icon: <FaUsers />,
                    bg: "#038000",
                    cardBg: "#e9feea",
                },
                {
                    value: totalCategory,
                    label: "Categories",
                    icon: <FaCartShopping />,
                    bg: "#0200f8",
                    cardBg: "#ecebff",
                },
                ].map((item, idx) => (
                <div
                    key={idx}
                    className={`flex justify-between items-center p-5 rounded-xl shadow-md gap-4`}
                    style={{ backgroundColor: item.cardBg }}
                >
                    <div className="flex flex-col text-[#5c5a5a]">
                    <h2 className="text-3xl font-bold">{item.value}</h2>
                    <span className="text-md font-medium">{item.label}</span>
                    </div>
                    <div
                    className="w-12 h-12 rounded-full flex justify-center items-center text-white text-xl shadow-lg"
                    style={{ backgroundColor: item.bg }}
                    >
                    {item.icon}
                    </div>
                </div>
                ))}
            </div>

            {/* Biểu đồ và chi tiết */}
            <div className="w-full mt-10">
                <div className="bg-white shadow-md rounded-xl p-6">
                <ReactApexChart
                    options={chartData.options}
                    series={chartData.series}
                    type="line"
                    width="100%"
                    height={400}
                />

                {selectedMonthInfo && (
                    <div className="mt-4 px-4">
                    <div className="flex items-center justify-between">
                        <p className="text-lg font-medium text-gray-800">
                        Doanh thu tháng {selectedMonthInfo.month}:{' '}
                        <span className="text-blue-600 font-semibold">
                            {selectedMonthInfo.money.toLocaleString('vi-VN')}đ
                        </span>
                        </p>
                        <button
                        onClick={() => setShowDetail(!showDetail)}
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                        <AiOutlineInfoCircle />
                        {showDetail ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                        </button>
                    </div>
                    {showDetail && (
                        <div className="mt-3 border-t border-gray-200 pt-3">
                        <h3 className="text-base font-semibold mb-2 text-gray-700">
                            Chi tiết chi tiêu trong tháng {selectedMonthInfo.month}
                        </h3>
                        <ul className="space-y-1 text-sm text-gray-700">
                            {dataMonth && dataMonth.length > 0 ? (
                            dataMonth.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                <span className="text-blue-500">•</span>
                                <span>
                                    Ngày{' '}
                                    <span className="font-medium">
                                    {new Date(item.date).toLocaleDateString('vi-VN')}:
                                    </span>{' '}
                                    {item.money.toLocaleString('vi-VN')}đ
                                </span>
                                </li>
                            ))
                            ) : (
                            <p className="italic text-gray-500">Không có dữ liệu.</p>
                            )}
                        </ul>
                        </div>
                    )}
                    </div>
                )}
                </div>
            </div>

            {/* Danh sách thuốc sắp hết hạn */}
            <div className="mt-10">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className='flex items-center justify-between'>
                        <h2 className='text-xl font-semibold mb-4'>Thuốc sắp hết hạn</h2>
                        <div className='flex items-center justify-center text-sm text-blue-600 space-x-1 cursor-pointer'
                        onClick={() => navigate('/admin/inventory')}>
                            <p>Tới xem</p>
                            <IoIosArrowForward />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Tên thuốc</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Hạn sử dụng</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Số lượng còn</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {nearExpiryList.length > 0 ? (
                            nearExpiryList.map((item) => (
                            <tr key={item.lotCode} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm text-gray-900">{item.product.name}</td>
                                <td className="px-4 py-2 text-sm text-gray-900">{new Date(item.dateExpiration).toLocaleDateString('vi-VN')}</td>
                                <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                            <td colSpan="4" className="text-center text-sm text-gray-500 py-5 italic">
                                Không có thuốc sắp hết hạn trong thời gian tới.
                            </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
            {/* Danh sách thuốc sắp hết hàng */}
            <div className="mt-10">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold mb-4">Thuốc sắp hết hàng</h2>
                    <div
                        className="flex items-center justify-center text-sm text-blue-600 space-x-1 cursor-pointer"
                        onClick={() => navigate('/admin/inventory')}
                    >
                        <p>Tới xem</p>
                        <IoIosArrowForward />
                    </div>
                    </div>
                    <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Tên thuốc</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Đơn vị</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Số lượng còn</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {lowStockList.length > 0 ? (
                            lowStockList.map((item) => (
                            <tr key={item.lotCode} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm text-gray-900">{item.product.name}</td>
                                <td className="px-4 py-2 text-sm text-gray-900">{item.unit.name}</td>
                                <td className="px-4 py-2 text-sm text-orange-600 font-medium">{item.quantity}</td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                            <td colSpan="3" className="text-center text-sm text-gray-500 py-5 italic">
                                Không có thuốc sắp hết hàng hiện tại.
                            </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
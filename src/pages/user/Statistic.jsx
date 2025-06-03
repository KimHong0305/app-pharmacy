import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import ReactApexChart from 'react-apexcharts';
import { getStatisticMonth, getStatisticYear } from '../../store/Reducers/statisticReducer';
import { IoReturnDownBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { AiOutlineInfoCircle } from "react-icons/ai";

const Statistic = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { dataYear, dataMonth } = useSelector((state) => state.statistic);
    const [selectedMonthInfo, setSelectedMonthInfo] = useState(null);
    const moneyArrayRef = useRef(Array(12).fill(0));
    const [showDetail, setShowDetail] = useState(false);
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
                            dispatch(getStatisticMonth({ month: monthIndex + 1, year: 2025 }));
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
        dispatch(getStatisticYear(2025));
    }, [dispatch]);

    const handleGoBack = () => {
        navigate(-1);
    };

    console.log(dataYear)

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
        <div>
            <Header />
            <div className="bg-slate-100 py-10">
                <div className="px-4 md:px-8 lg:px-48 container mx-auto">
                    <div className="bg-gray-50 rounded-lg shadow-xl min-h-[400px] p-6">
                        <span onClick={handleGoBack} className="inline-block cursor-pointer">
                            <IoReturnDownBackSharp className="inline-block" />
                            <button className="inline-block ml-5">Quay lại</button>
                        </span>
                        <div className="w-full flex flex-col items-center justify-center">
                            <p className="mt-2 text-2xl font-semibold">CHI TIÊU SỨC KHỎE</p>
                            <ReactApexChart
                                options={chartData.options}
                                series={chartData.series}
                                type="line"
                                width={900}
                                height={400}
                            />
                        </div>
                        {selectedMonthInfo && (
                        <>
                            <div className='flex flex-col items-end justify-center px-24'>
                                <p className="text-lg font-medium mt-2">
                                    Chi tiêu tháng {selectedMonthInfo.month}: {selectedMonthInfo.money.toLocaleString('vi-VN')}đ
                                </p>
                                <div 
                                    className="flex justify-end items-end cursor-pointer group"
                                    onClick={() => setShowDetail(!showDetail)}
                                >
                                    <AiOutlineInfoCircle className="text-base text-blue-700 group-hover:text-blue-900 transition" />
                                    <p className="ml-1 text-sm text-blue-700 group-hover:text-blue-900 transition">
                                        {showDetail ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                                    </p>
                                </div>
                            </div>
                        </>
                        )}
                        {showDetail && (
                            <div className="mt-4 w-full px-24">
                                <h3 className="text-lg font-semibold mb-2">
                                    Chi tiết chi tiêu theo ngày trong tháng {selectedMonthInfo.month}
                                </h3>
                                <div className="text-sm space-y-1">
                                    {dataMonth && dataMonth.length > 0 ? (
                                        dataMonth.map((item, index) => (
                                        <p
                                            key={index}
                                            className="text-gray-700 text-sm flex items-center gap-2 border-b border-dashed border-gray-200 pb-1"
                                        >
                                            <span className="text-blue-500">•</span>
                                            <span>
                                                <span className="font-medium">Ngày {new Date(item.date).toLocaleDateString('vi-VN')}:</span>{' '}
                                                {item.money.toLocaleString('vi-VN')}đ
                                            </span>
                                        </p>

                                        ))
                                    ) : (
                                        <p className="italic text-gray-500">Không có dữ liệu chi tiêu trong tháng này.</p>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Statistic;

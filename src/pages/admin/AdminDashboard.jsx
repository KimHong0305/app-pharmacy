import React, { useEffect, useState, useRef } from 'react';
import { MdCurrencyExchange,MdProductionQuantityLimits } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6"; 
import { useDispatch, useSelector } from 'react-redux';
import { getTotalCategory, getTotalCompany, getTotalProduct, getTotalUser } from '../../store/Reducers/dashboardReducer';
import { getStatisticMonthForAdmin, getStatisticYearForAdmin } from '../../store/Reducers/statisticReducer';
import { AiOutlineInfoCircle } from "react-icons/ai";
import ReactApexChart from 'react-apexcharts';

const AdminDashboard = () => {

    const dispatch = useDispatch()
    const {totalUser, totalCompany, totalProduct, totalCategory} = useSelector(state=> state.dashboard)

    useEffect(() => {
        dispatch(getTotalUser());
        dispatch(getTotalCompany());
        dispatch(getTotalProduct());
        dispatch(getTotalCategory());

    }, [dispatch])

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
        <div className='px-2 md:px-7 py-5'>


            <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7'>
                
                <div className='flex justify-between shadow-md items-center p-5 bg-[#fae8e8] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-3xl font-bold'>{totalUser}</h2>
                        <span className='text-md font-medium'>Total Users</span>
                    </div>

                    <div className='w-[40px] h-[47px] rounded-full bg-[#fa0305] flex justify-center items-center text-xl'>
                    <MdCurrencyExchange className='text-[#fae8e8] shadow-lg' /> 
                    </div> 
                </div>


                <div className='flex shadow-md justify-between items-center p-5 bg-[#fde2ff] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-3xl font-bold'>{totalCompany}</h2>
                        <span className='text-md font-medium'>Companies</span>
                    </div>

                    <div className='w-[40px] h-[47px] rounded-full bg-[#760077] flex justify-center items-center text-xl'>
                    <MdProductionQuantityLimits  className='text-[#fae8e8] shadow-lg' /> 
                    </div> 
                </div>


                <div className='flex shadow-md justify-between items-center p-5 bg-[#e9feea] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-3xl font-bold'>{totalProduct}</h2>
                        <span className='text-md font-medium'>Products</span>
                    </div>

                    <div className='w-[40px] h-[47px] rounded-full bg-[#038000] flex justify-center items-center text-xl'>
                    <FaUsers  className='text-[#fae8e8] shadow-lg' /> 
                    </div> 
                </div>


                <div className='flex shadow-md justify-between items-center p-5 bg-[#ecebff] rounded-md gap-3'>
                    <div className='flex flex-col justify-start items-start text-[#5c5a5a]'>
                        <h2 className='text-3xl font-bold'>{totalCategory}</h2>
                        <span className='text-md font-medium'>Categories</span>
                    </div>

                    <div className='w-[40px] h-[47px] rounded-full bg-[#0200f8] flex justify-center items-center text-xl'>
                    <FaCartShopping  className='text-[#fae8e8] shadow-lg' /> 
                    </div> 
                </div>
 
            </div>

        
        
        <div className='w-full flex flex-wrap mt-7'>
            <div className='w-full lg:pr-3'>
                <div className='w-full drop-shadow-md bg-[#ffffff] p-4 rounded-md'>
                    <ReactApexChart
                        options={chartData.options}
                        series={chartData.series}
                        type="line"
                        width='100%'
                        height={400}
                    />
                    {selectedMonthInfo && (
                <>
                    <div className='flex flex-col items-end justify-center px-24'>
                        <p className="text-lg font-medium mt-2">
                            Doanh thu tháng {selectedMonthInfo.month}: {selectedMonthInfo.money.toLocaleString('vi-VN')}đ
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
                            Doanh thu theo ngày trong tháng {selectedMonthInfo.month}
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
        </div>
    );
};

export default AdminDashboard;
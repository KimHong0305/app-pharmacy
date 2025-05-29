import React, { useEffect } from 'react';
import Chart from 'react-apexcharts'
import { useDispatch } from 'react-redux';
import { getEmployeeInfo } from '../../store/Reducers/userReducer';

const NurseDashboard = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getEmployeeInfo());
    }, [dispatch]);

    const state = {
        series : [
            {
                name : "Orders",
                data : [23,34,45,56,76,34,23,76,87,78,34,45]
            },
            {
                name : "Revenue",
                data : [67,39,45,56,90,56,23,56,87,78,67,78]
            },
            {
                name : "Users",
                data : [34,39,56,56,80,67,23,56,98,78,45,56]
            },
        ],
        options : {
            color : ['#181ee8','#181ee8'],
            plotOptions: {
                radius : 30
            },
            chart : {
                background : 'transparent',
                foreColor : '#d0d2d6'
            },
            dataLabels : {
                enabled : false
            },
            strock : {
                show : true,
                curve : ['smooth','straight','stepline'],
                lineCap : 'butt',
                colors : '#f0f0f0',
                width  : .5,
                dashArray : 0
            },
            xaxis : {
                categories : ['Jan','Feb','Mar','Apl','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
            },
            legend : {
                position : 'top'
            },
            responsive : [
                {
                    breakpoint : 565,
                    yaxis : {
                        categories : ['Jan','Feb','Mar','Apl','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
                    },
                    options : {
                        plotOptions: {
                            bar : {
                                horizontal : true
                            }
                        },
                        chart : {
                            height : "550px"
                        }
                    }
                }
            ]
        }
    }




    return (
        <div className='px-2 md:px-7 py-5'>
        
        
        <div className='w-full flex flex-wrap mt-7'>
            <div className='w-full lg:pr-3'>
                <div className='w-full drop-shadow-md bg-[#ffffff] p-4 rounded-md'>
            <Chart options={state.options} series={state.series} type='bar' height={350} />
                </div>
            </div>
        </div>
        </div>
    );
};

export default NurseDashboard;
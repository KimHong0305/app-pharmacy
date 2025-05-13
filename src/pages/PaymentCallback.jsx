import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";
import { updateCallBack } from "../store/Reducers/payment/callbackReducer";
import { useDispatch } from "react-redux";

const PaymentCallback = () => {
    const [searchParams] = useSearchParams();
    const [paymentInfo, setPaymentInfo] = useState({
        amount: null,
        orderInfo: "",
        responseCode: "",
        transactionNo: "",
    });
    const dispatch = useDispatch();

    const [tokenExists, setTokenExists] = useState(false);

    useEffect(() => {
        const allParams = Object.fromEntries([...searchParams.entries()]);
    
        let paymentMethod = "";
        let isSuccess = false;
        let amount = 0;
        let orderInfo = localStorage.getItem("lastOrderId");
        let transactionNo = "";
        let code = null;
    
        // === ZALOPAY ===
        if (allParams.hasOwnProperty("appid")) {
            paymentMethod = "ZaloPay";
            amount = Number(allParams.amount || 0);
            transactionNo = allParams.apptransid || "";
            isSuccess = allParams.status === "1";
            code = allParams.status;
        }
    
        // === VNPAY ===
        else if (allParams.hasOwnProperty("vnp_Amount")) {
            paymentMethod = "VNPay";
            amount = Number(allParams.vnp_Amount || 0) / 100;
            transactionNo = allParams.vnp_TransactionNo || "";
            isSuccess = allParams.vnp_ResponseCode === "00";
            code = isSuccess ? "0" : allParams.vnp_ResponseCode;
        }
    
        // === MOMO ===
        else if (allParams.hasOwnProperty("partnerCode")) {
            paymentMethod = "MoMo";
            amount = Number(allParams.amount || 0);
            transactionNo = allParams.transId || "";
            isSuccess = allParams.errorCode === "0";
            code = allParams.errorCode;
        }
    
        setPaymentInfo({
            amount,
            orderInfo,
            responseCode: isSuccess ? "0" : "1",
            transactionNo,
        });
    
        const token = localStorage.getItem("token");
        setTokenExists(!!token);
        if (orderInfo && code !== null) {
            dispatch(updateCallBack({ orderId: orderInfo, code }));
            // console.log('don hang', orderInfo);
            // console.log('ma', code);
        }        
    }, [searchParams, dispatch]);    

    const isSuccess = paymentInfo.responseCode === "0";

    return (
        <div>
            <Header />
            <div className="px-4 md:px-8 lg:px-48 py-10">
                <div className="min-h-96 flex flex-col items-center justify-center bg-gray-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                        <h1 className="text-2xl font-semibold text-center mb-6">
                            {isSuccess ? (
                                <div className="text-green-500">
                                    <div className="mb-4 flex flex-col items-center justify-center">
                                        <FaCircleCheck className="h-16 w-16" />
                                    </div>
                                    <p className="text-2xl">Thanh toán thành công!</p>
                                </div>
                            ) : (
                                <div className="text-red-500">
                                    <div className="mb-4 flex flex-col items-center justify-center">
                                        <IoIosCloseCircle className="h-16 w-16" />
                                    </div>
                                    <p className="text-xl">Thanh toán thất bại</p>
                                </div>
                            )}
                        </h1>
                        {isSuccess ? (
                            <div className="text-center">
                                <p className="mb-3">{paymentInfo.orderInfo}</p>
                                {!tokenExists && (
                                    <div className="flex flex-col bg-amber-100 my-5 rounded-lg font-semibold py-2">
                                        <p>Đây là mã đơn hàng của bạn</p>
                                        <p className="text-amber-600 text-lg">{paymentInfo.orderInfo}</p>
                                        <p>Hãy lưu lại để tra cứu</p>
                                    </div>
                                )}
                                <button
                                    className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                    onClick={() => {
                                        window.location.href = "/";
                                    }}
                                >
                                    Quay về trang chủ
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="mb-3">Có lỗi xảy ra trong quá trình thanh toán.</p>
                                <button
                                    className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                    onClick={() => {
                                        window.location.href = "/";
                                    }}
                                >
                                    Thử lại sau
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PaymentCallback;

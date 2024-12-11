import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosCloseCircle } from "react-icons/io";

const PaymentCallback = () => {
    const [searchParams] = useSearchParams();
    const [paymentInfo, setPaymentInfo] = useState({
        amount: null,
        orderInfo: "",
        responseCode: "",
        transactionNo: "",
    });

    useEffect(() => {
        const amount = searchParams.get("vnp_Amount");
        const orderInfo = decodeURIComponent(
        searchParams.get("vnp_OrderInfo") || ""
        );
        const responseCode = searchParams.get("vnp_ResponseCode");
        const transactionNo = searchParams.get("vnp_TransactionNo");

        setPaymentInfo({
        amount: amount ? Number(amount) / 100 : 0,
        orderInfo,
        responseCode,
        transactionNo,
        });
    }, [searchParams]);

    const isSuccess = paymentInfo.responseCode === "00";

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
                        <FaCircleCheck className="h-16 w-16"/>
                    </div>
                    <p className="text-2xl">Thanh toán thành công!</p>
                    </div>
                ) : (
                    <div className="text-red-500">
                    <div className="mb-4 flex flex-col items-center justify-center">
                        <IoIosCloseCircle className="h-16 w-16"/>
                    </div>
                    <p className="text-xl">Thanh toán thất bại</p>
                    </div>
                )}
                </h1>
                {isSuccess ? (
                <div className="text-center">
                    <p className="mb-3 font-medium">
                    <strong>Mã giao dịch:</strong> {paymentInfo.transactionNo}
                    </p>
                    <p className="mb-3 font-medium">
                    <strong>Số tiền:</strong> {paymentInfo.amount.toLocaleString()} VNĐ
                    </p>
                    <p className="mb-3">{paymentInfo.orderInfo}</p>
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

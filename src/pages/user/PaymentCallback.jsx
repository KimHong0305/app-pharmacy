import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

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
        <Header/>
        <div className="px-4 md:px-8 lg:px-48">
            <div className="min-h-96 flex flex-col items-center justify-center">
                <div className="">
                    <h1 className="text-xl font-bold text-center mb-4">
                        {isSuccess ? (
                        <div className="text-green-400">
                            <div className="text-[40px]">
                            <i class="fa-solid fa-circle-check"></i>
                            </div>
                            <p className="mt-5">"Thanh toán thành công!"</p>
                        </div>
                        ) : (
                        <div className="">
                            <div className="bg-red-500">
                            <i class="fa-solid fa-circle-exclamation"></i>
                            </div>

                            <p className="bg-red-500">"Thanh toán thất bại"</p>
                        </div>
                        )}
                    </h1>
                    {isSuccess ? (
                        <div className="text-center">
                        <p className="mb-2 font-bold">
                            Mã giao dịch: {paymentInfo.transactionNo}
                        </p>
                        <p className="mb-2 font-bold">
                            Số tiền: {paymentInfo.amount.toLocaleString()} VNĐ
                        </p>
                        <p className="mb-2 font-bold">{paymentInfo.orderInfo}</p>
                        <button
                            className="p-2 bg-blue-500 text-white rounded"
                            onClick={() => {
                            window.location.href = "/";
                            }}
                        >
                            Quay về trang chủ
                        </button>
                        </div>
                    ) : (
                        <div className="text-center">
                        <p className="mb-2">Có lỗi xảy ra trong quá trình thanh toán.</p>
                        <button
                            className="p-2 bg-red-500 text-white rounded"
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
        <Footer/>
    </div>
  );
};

export default PaymentCallback;
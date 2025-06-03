import React from "react";

const PaymentConfirmDialog = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl animate-fade-in">
                <h2 className="text-xl font-semibold mb-4">Xác nhận thanh toán</h2>
                <p className="text-gray-600 mb-6">
                    Bạn muốn thanh toán đơn hàng ngay bây giờ hay để sau?
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                    >
                        Để sau
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        Thanh toán ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentConfirmDialog;

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

const VoucherDialog = ({ isOpen, onClose, vouchers, onSelectVoucher, totalPrice }) => {
    const [selectedVoucher, setSelectedVoucher] = useState(null);

    if (!isOpen) return null;

    const handleSelectVoucher = (voucher) => {
        if (totalPrice >= voucher.orderRequire) {
            setSelectedVoucher(voucher);
        }
    };

    const handleApply = () => {
        if (selectedVoucher) {
            onSelectVoucher(selectedVoucher); // Trả về toàn bộ object voucher
            onClose();
        }
    };

    return (
        <div className="fixed top-0 right-0 w-full h-full flex items-start justify-end bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 w-96 h-full flex flex-col relative rounded-l-lg shadow-lg">
                {/* Nút đóng */}
                <button className="absolute top-3 right-3 text-gray-600" onClick={onClose}>
                    <IoClose size={24} />
                </button>

                <h2 className="text-lg font-semibold mb-4">Chọn mã giảm giá</h2>

                <div className="flex-1 space-y-4 overflow-y-auto">
                    {vouchers.length > 0 ? (
                        vouchers.map((voucher) => {
                            const isDisabled = totalPrice < voucher.orderRequire;
                            return (
                                <label 
                                    key={voucher.id} 
                                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                                        isDisabled ? "opacity-70 cursor-not-allowed": ""
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <img src={voucher.image} alt={voucher.name} className="w-16 h-16 object-cover rounded-md" />
                                        <div className="ml-4">
                                            <p className="font-medium mb-1">{voucher.name}</p>
                                            <p className="text-sm text-gray-500 mb-1">{voucher.description}</p>
                                            <p className="text-xs text-red-500">HSD: {voucher.expireDate}</p>
                                        </div>
                                    </div>

                                    <input 
                                        type="radio" 
                                        className="ml-2 w-6 h-6 accent-blue-500 rounded-full" 
                                        checked={selectedVoucher?.id === voucher.id} 
                                        onChange={() => handleSelectVoucher(voucher)}
                                        disabled={isDisabled}
                                    />
                                </label>
                            );
                        })
                    ) : (
                        <p className="text-center text-gray-500">Không có voucher nào</p>
                    )}
                </div>

                <button 
                    className={`mt-4 w-full py-2 rounded-lg ${
                        selectedVoucher ? "bg-blue-500 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                    onClick={handleApply}
                    disabled={!selectedVoucher}
                >
                    Áp dụng
                </button>
            </div>
        </div>
    );
};

export default VoucherDialog;

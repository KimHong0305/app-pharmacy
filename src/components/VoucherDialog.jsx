import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { getCouponById } from "../store/Reducers/couponReducer";
import { useDispatch } from "react-redux";

const VoucherDialog = ({ isOpen, onClose, vouchers, onSelectVoucher, totalPrice }) => {
    const dispatch = useDispatch();

    const [selectedVouchers, setSelectedVouchers] = useState({
        PRODUCT: null,
        DELIVERY: null
    });

    const [manualCode, setManualCode] = useState("");
    const [inputError, setInputError] = useState(null);
    const [fetchedVoucher, setFetchedVoucher] = useState(null);

    if (!isOpen) return null;

    const isVoucherValid = (voucher) => {
        const [day, month, year] = voucher.expireDate.split('/');
        const expireDate = new Date(`${year}-${month}-${day}`);
        return expireDate > new Date() && totalPrice >= voucher.orderRequire;
    };

    const handleSelectVoucher = (voucher) => {
        if (isVoucherValid(voucher)) {
            setSelectedVouchers((prev) => ({
                ...prev,
                [voucher.couponType]: voucher
            }));
            setInputError(null);
        }
    };

    const handleApply = () => {
        if (selectedVouchers.PRODUCT || selectedVouchers.DELIVERY) {
            onSelectVoucher(selectedVouchers);
            onClose();
        }
    };

    const handleManualApply = async () => {
        setInputError(null);
        setFetchedVoucher(null);
        const code = manualCode.trim();

        if (!code) {
            setInputError("Vui lòng nhập mã voucher.");
            return;
        }

        try {
            const coupon = await dispatch(getCouponById(code)).unwrap();
            const isValid = isVoucherValid(coupon);

            if (!isValid) {
                const [day, month, year] = coupon.expireDate.split('/');
                const expireDate = new Date(`${year}-${month}-${day}`);
                if (expireDate <= new Date()) {
                    setInputError("Mã đã hết hạn.");
                } else {
                    setInputError(`Cần tối thiểu ${coupon.orderRequire.toLocaleString("vi-VN")}đ để dùng mã này.`);
                }
                return;
            }

            setFetchedVoucher(coupon);
            setSelectedVouchers((prev) => ({
                ...prev,
                [coupon.couponType]: coupon
            }));
        } catch {
            setInputError("Không tìm thấy mã giảm giá.");
        }
    };

    const productVouchers = vouchers.filter(v => v.couponType === "PRODUCT");
    const deliveryVouchers = vouchers.filter(v => v.couponType === "DELIVERY");

    const renderVoucherList = (voucherList) =>
        voucherList.map((voucher) => {
            const isDisabled = !isVoucherValid(voucher);
            const isChecked = selectedVouchers[voucher.couponType]?.id === voucher.id;

            return (
                <label
                    key={voucher.id}
                    className={`flex items-center justify-between bg-slate-50 pr-4 rounded-lg
                        ${
                            isDisabled
                                ? "opacity-60 cursor-not-allowed shadow"
                                : "shadow hover:shadow-lg cursor-pointer transition-shadow duration-200"
                        }
                    `}
                >
                    <div className="flex items-center gap-4">
                        <img
                            src={voucher.image}
                            alt={voucher.name}
                            className="w-[80px] h-[120px] rounded-l-lg object-cover"
                        />
                        <div className="flex flex-col gap-1 py-2">
                            <p className="font-semibold">{voucher.name}</p>
                            <p className="text-xs text-gray-600">{voucher.description}</p>
                            <p className="text-xs text-red-500">HSD: {voucher.expireDate}</p>
                        </div>
                    </div>
                    <input
                        type="radio"
                        className="accent-blue-500 w-5 h-5 ml-2"
                        checked={isChecked}
                        onChange={() => handleSelectVoucher(voucher)}
                        disabled={isDisabled}
                    />
                </label>
            );
        });

    const hasSelected = selectedVouchers.PRODUCT || selectedVouchers.DELIVERY;

    return (
        <div className="fixed inset-0 flex justify-end bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full sm:w-[400px] h-full p-6 rounded-l-2xl shadow-xl flex flex-col relative">
                <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" onClick={onClose}>
                    <IoClose size={24} />
                </button>

                <h2 className="text-xl font-bold mb-6">Chọn mã giảm giá</h2>

                <div className="mb-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Nhập mã voucher"
                            value={manualCode}
                            onChange={(e) => setManualCode(e.target.value)}
                        />
                        <button
                            onClick={handleManualApply}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                        >
                            <FaSearch />
                        </button>
                    </div>
                    {inputError && <p className="text-sm text-red-500 mt-1">{inputError}</p>}
                </div>

                {fetchedVoucher && !vouchers.some(v => v.id === fetchedVoucher.id) && (
                    <label
                        key={fetchedVoucher.id}
                        className="flex items-center justify-between p-4 border-2 border-green-500 bg-green-50 rounded-xl mb-4"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={fetchedVoucher.image}
                                alt={fetchedVoucher.name}
                                className="w-14 h-14 rounded-lg object-cover"
                            />
                            <div>
                                <p className="font-semibold">{fetchedVoucher.name}</p>
                                <p className="text-sm text-gray-600">{fetchedVoucher.description}</p>
                                <p className="text-xs text-red-500">HSD: {fetchedVoucher.expireDate}</p>
                            </div>
                        </div>
                        <input
                            type="radio"
                            className="accent-blue-500 w-5 h-5"
                            checked={selectedVouchers[fetchedVoucher.couponType]?.id === fetchedVoucher.id}
                            onChange={() => handleSelectVoucher(fetchedVoucher)}
                        />
                    </label>
                )}

                <div className="flex-1 overflow-y-auto pr-1 space-y-5">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Giảm giá sản phẩm</h3>
                        {productVouchers.length > 0 ? (
                            renderVoucherList(productVouchers)
                        ) : (
                            <p className="text-sm text-gray-500">Không có mã giảm giá sản phẩm</p>
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Giảm giá giao hàng</h3>
                        {deliveryVouchers.length > 0 ? (
                            renderVoucherList(deliveryVouchers)
                        ) : (
                            <p className="text-sm text-gray-500">Không có mã giảm giá giao hàng</p>
                        )}
                    </div>
                </div>

                <button
                    className={`mt-6 py-3 rounded-xl font-semibold transition-all ${
                        hasSelected
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                    onClick={handleApply}
                    disabled={!hasSelected}
                >
                    Áp dụng
                </button>
            </div>
        </div>
    );
};

export default VoucherDialog;

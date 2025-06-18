import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from '../../components/Header';
import Footer from "../../components/Footer";
import { getAddress } from "../../store/Reducers/addressReducer";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrderCartUser } from "../../store/Reducers/order/orderUserReducer";
import { toast } from 'react-toastify';
import { getCartUser } from "../../store/Reducers/cartReducer";
import { FaTicketAlt } from "react-icons/fa";
import { HiOutlineTicket } from "react-icons/hi2";
import { IoIosArrowForward } from "react-icons/io";
import VoucherDialog from "../../components/VoucherDialog";
import PaymentMethodSelector from '../../components/PaymentMethodSelector';
import ShippingMethodSelector from '../../components/ShippingMethodSelector';
import usePaymentRedirect from "../../hooks/usePaymentRedirect";
import PaymentConfirmDialog from "../../components/PaymentConfirmDialog";

const OrderCartUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { coupons } = useSelector((state) => state.coupon);  

    const {
        cartItems,
        totalPrice,
        selectedVouchers = { PRODUCT: null, DELIVERY: null, OTHER: null },
        discountAmount: initialDiscountAmount = 0
    } = location.state || {};

    const calculateProductDiscount = (voucher, price) => {
        if (!voucher || voucher.couponType !== "PRODUCT") return 0;
        const percentDiscount = (price * voucher.percent) / 100;
        return Math.min(percentDiscount, voucher.max);
    };

    const calculateDeliveryDiscount = (voucher, fee) => {
        if (!voucher || voucher.couponType !== "DELIVERY") return 0;
        const percentDiscount = (fee * voucher.percent) / 100;
        return Math.min(percentDiscount, voucher.max);
    };

    const calculateOtherDiscount = (voucher, price) => {
        if (!voucher || voucher.couponType !== "OTHER") return 0;
        const percentDiscount = (price * voucher.percent) / 100;
        return Math.min(percentDiscount, voucher.max);
    };

    const [defaultAddress, setDefaultAddress] = useState(null);
    const [showAddressList, setShowAddressList] = useState(false);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const { address } = useSelector((state) => state.address);
    const [voucher, setVoucher] = useState(selectedVouchers);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [shippingMethod, setShippingMethod] = useState("FAST");
    const [shippingFee, setShippingFee] = useState(0);
    const [service, setService] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    const [amount, setAmount] = useState(
        calculateProductDiscount(selectedVouchers.PRODUCT, totalPrice)
    );
    const [shippingDiscount, setShippingDiscount] = useState(
        calculateDeliveryDiscount(selectedVouchers.DELIVERY, shippingFee)
    );

    const [otherDiscount, setOtherDiscount] = useState(
        calculateOtherDiscount(selectedVouchers.OTHER, totalPrice)
    );

    const handleRedirectPayment = usePaymentRedirect();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await dispatch(getAddress());
            } catch (error) {
                console.error("Error fetching address:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [dispatch]);
    
    useEffect(() => {
        const defaultAddr = address.find((addr) => addr.addressDefault);
        if (defaultAddr) {
            setDefaultAddress(defaultAddr);
        }
    }, [address]);

    const handleAddressClick = (addr) => {
        setDefaultAddress(addr);
        setShowAddressList(false);
    };

    const handleAddAddress = () => {
        navigate('/user/addresses/new');
    }

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleOrder = async() => {
        const order = {
            couponIds: [
                ...(voucher?.PRODUCT ? [voucher.PRODUCT.id] : []),
                ...(voucher?.DELIVERY ? [voucher.DELIVERY.id] : []),
                ...(voucher?.OTHER ? [voucher.OTHER.id] : []),
            ],
            addressId: defaultAddress.id,
            paymentMethod: paymentMethod,
            isInsurance: false,
            service_id: service,
        };
        
        // console.log(order)
        try{
            const result = await dispatch(createOrderCartUser(order)).unwrap();
            toast.success("Đặt hàng thành công!");
            localStorage.setItem("lastOrderId", result.result.id);
            await dispatch(getCartUser());
            if (result.result.paymentMethod !== 'CASH'){
                setShowDialog(true);
            }
            else {
                setTimeout(() => {
                    navigate('/');
                }, 5000);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const handleConfirm = async () => {
        const orderId = localStorage.getItem('lastOrderId');
        setShowDialog(false);
        await handleRedirectPayment(paymentMethod, orderId);
    };

    const handleCancel = () => {
        setShowDialog(false);
        navigate('/');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl">Đang tải dữ liệu...</p>
            </div>
        );
    }

    // console.log('dia chi',defaultAddress)
    return (
        <div>
            <Header />
            <div className="px-4 md:px-8 lg:px-48">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-5">
                    {/* Danh sách sản phẩm */}
                    <div className="md:col-span-3 p-4">
                        <h2 className="text-2xl font-bold mb-4">Sản phẩm</h2>
                        {cartItems.map((item) => (
                            <div key={item.id} className="border-b py-4 flex items-center justify-between">
                                <div className="flex">
                                    <img
                                        className="w-16 h-16 rounded-md mr-4"
                                        src={item.image}
                                        alt={item.productName}
                                    />
                                    <div className="flex-grow w-[500px]">
                                        <p className="font-medium break-words">{item.productName}</p>
                                        <p className="text-sm text-gray-500">{item.unitName}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 px-2">x{item.quantity}</p>
                                <p className="font-medium">
                                    {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.amount)}
                                </p>
                            </div>
                        ))}

                        <h2 className="text-lg font-bold mt-6">Thông tin người nhận</h2>
                        <div className="py-2 border-b border-gray-300 text-sm space-y-2">
                        {!defaultAddress ? (
                            <div className="text-gray-500">
                                Không có địa chỉ nào. Vui lòng thêm địa chỉ mới.
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between">
                                    <div className="flex">
                                        <p className="font-semibold text-black">{defaultAddress.fullname}</p>
                                        <div className="ml-2 mr-2 border-r border-gray-300"></div>
                                        <p>(+84) {defaultAddress.phone}</p>
                                    </div>
                                    <p className="w-[90px] px-2 text-center rounded border border-blue-700 text-blue-700">
                                        {defaultAddress.addressCategory === "HOUSE"
                                            ? "Nhà riêng"
                                            : defaultAddress.addressCategory === "COMPANY"
                                            ? "Văn phòng"
                                            : "Loại khác"}
                                    </p>
                                </div>
                                <p>{defaultAddress.address}</p>
                                <p>{defaultAddress.wardName +", "+  defaultAddress.districtName + ", " + defaultAddress.provinceName}</p>
                                {defaultAddress.addressDefault && (
                                    <p className="w-[80px] px-2 text-center rounded border border-red-600 text-red-600">
                                        Mặc định
                                    </p>
                                )}
                            </>
                            )}

                            <button
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                                onClick={() => setShowAddressList((prev) => !prev)}
                            >
                                {showAddressList ? "Đóng danh sách địa chỉ" : "Chọn địa chỉ khác"}
                            </button>
                        </div>

                        {/* Phương thức vận chuyển */}
                        <ShippingMethodSelector
                            shippingMethod={shippingMethod}
                            setShippingMethod={setShippingMethod}
                            districtId={defaultAddress?.district || null}
                            wardCode={defaultAddress?.village || null}
                            total={cartItems.reduce((total, item) => total + item.amount, 0)}
                            setShippingFee={setShippingFee}
                            setService={setService}
                        />

                        {/* Phương thức thanh toán */}
                        <PaymentMethodSelector
                            paymentMethod={paymentMethod}
                            onChange={handlePaymentMethodChange}
                        />
                        
                        {showAddressList && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white p-6 rounded-md shadow-lg w-[600px]">
                                <h3 className="text-lg font-bold mb-4">Chọn địa chỉ</h3>
                                <div className="max-h-80 overflow-y-auto">
                                {address.map((addr) => (
                                    <div key={addr.id} className="p-4 border-b border-gray-300 text-sm text-gray-400 space-y-2"
                                    onClick={() => handleAddressClick(addr)}>
                                        <div className='flex justify-between'>
                                            <div className='flex'>
                                                <p className='font-semibold text-black'>
                                                    {addr.fullname}
                                                </p>
                                                <div className="ml-2 mr-2 border-r border-gray-300"></div>
                                                <p>
                                                    (+84) {addr.phone}
                                                </p>
                                            </div>
                                            <p className="w-[90px] px-2 text-center rounded border border-blue-700 text-blue-700">
                                                {addr.addressCategory === "HOUSE" ? "Nhà riêng" : 
                                                addr.addressCategory === "COMPANY" ? "Văn phòng" : "Loại khác"}
                                            </p>
                                        </div>
                                        <p>
                                            {addr.address}
                                        </p>
                                        <p>{addr.wardName +", "+  addr.districtName + ", " + addr.provinceName}</p>
                                        {addr.addressDefault && (
                                            <p className='w-[80px] px-2 text-center rounded border border-red-600 text-red-600'>
                                                Mặc định
                                            </p>
                                        )}
                                    </div>
                                ))}
                                    <button className="mt-5 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600" 
                                    onClick= {handleAddAddress}
                                    >
                                        <div className='flex items-center justify-center'>
                                            <IoIosAddCircleOutline className='mr-1'/>
                                            <p>Thêm địa chỉ mới</p>
                                        </div>
                                    </button>
                                </div>
                                <div className="flex justify-end space-x-4 mt-4">
                                    <button
                                        className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                                        onClick={() => setShowAddressList(false)}
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        </div>
                        )}

                    </div>

                    {/* Chi tiết thanh toán */}
                    <div className="fixed p-4 w-1/5 border rounded top-[200px] right-[100px]">
                        <h2 className="text-lg font-bold mb-4">Chi tiết thanh toán</h2>
                        <div className="cursor-pointer flex justify-between items-center pb-3 border-b border-gray-200"
                        onClick={() => setIsDialogOpen(true)}>
                            <div className="flex justify-start items-center">
                            <HiOutlineTicket className="text-xl text-blue-700"/>
                            <p className="ml-2 text-sm font-medium">Mã giảm giá</p>
                            </div>
                            <p>
                            <IoIosArrowForward />
                            </p>
                        </div>
                        {(voucher?.PRODUCT || voucher?.DELIVERY || voucher?.OTHER) && (
                            <div className="space-y-2 my-2">
                                {voucher?.PRODUCT && (
                                <div className="flex justify-between items-center bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 shadow-sm relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-300 rounded-l-lg" />
                                    <div className="flex items-center space-x-2 z-10">
                                    <div className="bg-white text-orange-500 rounded-full p-1.5 flex items-center justify-center shadow-sm">
                                        <FaTicketAlt className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-orange-700">{voucher.PRODUCT.name}</p>
                                    </div>
                                    </div>
                                    <button
                                    onClick={() => {
                                        setVoucher((prev) => ({ ...prev, PRODUCT: null }));
                                        setAmount(0);
                                    }}
                                    className="text-[10px] text-red-500 hover:text-red-700 font-medium z-10"
                                    >
                                    Hủy
                                    </button>
                                </div>
                                )}

                                {voucher?.DELIVERY && (
                                <div className="flex justify-between items-center bg-green-50 border border-green-200 rounded-lg px-3 py-2 shadow-sm relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-300 rounded-l-lg" />
                                    <div className="flex items-center space-x-2 z-10">
                                    <div className="bg-white text-green-600 rounded-full p-1.5 flex items-center justify-center shadow-sm">
                                        <FaTicketAlt className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-green-700">{voucher.DELIVERY.name}</p>
                                    </div>
                                    </div>
                                    <button
                                    onClick={() => {
                                        setVoucher((prev) => ({ ...prev, DELIVERY: null }));
                                        setShippingDiscount(0);
                                    }}
                                    className="text-[10px] text-red-500 hover:text-red-700 font-medium z-10"
                                    >
                                    Hủy
                                    </button>
                                </div>
                                )}

                                {voucher?.OTHER && (
                                <div className="flex justify-between items-center bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 shadow-sm relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-300 rounded-l-lg" />
                                    <div className="flex items-center space-x-2 z-10">
                                    <div className="bg-white text-blue-600 rounded-full p-1.5 flex items-center justify-center shadow-sm">
                                        <FaTicketAlt className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-blue-700">{voucher.OTHER.name}</p>
                                    </div>
                                    </div>
                                    <button
                                    onClick={() => {
                                        setVoucher((prev) => ({ ...prev, OTHER: null }));
                                        setOtherDiscount(0);
                                    }}
                                    className="text-[10px] text-red-500 hover:text-red-700 font-medium z-10"
                                    >
                                    Hủy
                                    </button>
                                </div>
                                )}
                            </div>
                        )}

                        <p className="flex justify-between text-sm ">
                            <span>Tạm tính:</span>
                            <span>
                            {totalPrice.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            })}
                            </span>
                        </p>
                        <p className="flex justify-between my-2 text-sm ">
                            <span>Phí vận chuyển:</span>
                            <span>
                                {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingFee)}
                            </span>
                        </p>
                        <div className="flex justify-between items-center my-2 text-sm ">
                            <p>Ưu đãi vận chuyển:</p>
                            <p className="text-red-500">
                            - {shippingDiscount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                            </p>
                        </div>
                        <div className="flex justify-between items-center my-2 text-sm ">
                            <p>Voucher:</p>
                            <p className="text-red-500">
                            - {(amount + otherDiscount).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                            </p>
                        </div>
                        <div className="border-t border-gray-300 my-2"></div>
                        <p className="flex justify-between items-end font-bold">
                            <div className="flex flex-col">
                                <span className="text-lg font-medium">Tổng tiền:</span>
                                <span className="text-sm font-normal text-gray-500">
                                    {cartItems.reduce((total, item) => total + item.quantity, 0)} sản phẩm
                                </span>
                            </div>
                            <p className="text-xl font-semibold text-red-500">
                                {/* <span className="text-xs line-through mr-1 text-gray-500">{totalPrice}</span> */}
                                {(totalPrice - amount + shippingFee - shippingDiscount - otherDiscount).toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })}
                            </p>
                        </p>
                        <button
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded mt-4 hover:bg-blue-700"
                            onClick={handleOrder}
                        >
                            Đặt hàng
                        </button>
                    </div>
                </div>
                <VoucherDialog 
                    isOpen={isDialogOpen} 
                    onClose={() => setIsDialogOpen(false)} 
                    vouchers={coupons} 
                    totalPrice={totalPrice}
                    onSelectVoucher={(selected) => {
                        setVoucher(selected);

                        const newAmount = calculateProductDiscount(selected.PRODUCT, totalPrice);
                        setAmount(newAmount);

                        const deliveryDiscount = calculateDeliveryDiscount(selected.DELIVERY, shippingFee);
                        setShippingDiscount(deliveryDiscount);

                        const otherDiscount = calculateOtherDiscount(selected.OTHER, totalPrice);
                        setOtherDiscount(otherDiscount)

                        setIsDialogOpen(false);
                    }}
                />

                {showDialog && (
                    <PaymentConfirmDialog onConfirm={handleConfirm} onCancel={handleCancel} />
                )}
            </div>
            <Footer />
        </div>
    );
};

export default OrderCartUser;
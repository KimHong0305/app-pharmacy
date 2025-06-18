import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  getCartGuest, 
  updateCartGuest, 
  deleteCartGuest, 
  getCartUser, 
  updateCartUser, 
  deleteCartUser,
} from "../store/Reducers/cartReducer";
import { FaRegTrashCan} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { getCouponUser } from '../store/Reducers/couponReducer';
import { HiOutlineTicket } from "react-icons/hi2";
import { IoIosArrowForward } from "react-icons/io";
import VoucherDialog from "../components/VoucherDialog";
import { FaTicketAlt } from "react-icons/fa";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, totalPrice, loading } = useSelector((state) => state.cart);
  const { coupons } = useSelector((state) => state.coupon);
  const token = localStorage.getItem('token');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVouchers, setSelectedVouchers] = useState({});
  const [discountAmount, setDiscountAmount] = useState(0);

  const calculateTotalDiscount = (vouchersObj, total) => {
    let discount = 0;
    Object.values(vouchersObj).forEach(v => {
      if (v) {
        const d = (total * v.percent) / 100;
        discount += d < v.max ? d : v.max;
      }
    });
    return discount;
  };

  useEffect(() => {
    const discount = calculateTotalDiscount(selectedVouchers, totalPrice);
    setDiscountAmount(discount);
  }, [selectedVouchers, totalPrice]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          await dispatch(getCartUser()).unwrap();
          await dispatch(getCouponUser()).unwrap();
        } else {
          await dispatch(getCartGuest()).unwrap();
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchData();
  }, [dispatch, token]);

  useEffect(() => {
    const discount = calculateTotalDiscount(selectedVouchers, totalPrice);
    setDiscountAmount(discount);
  }, [selectedVouchers, totalPrice]);

  const handleRemoveItem = (id) => {
    const deleteItem = { cartItemId: id };
    const action = token ? deleteCartUser : deleteCartGuest;
    const refresh = token ? getCartUser : getCartGuest;

    dispatch(action(deleteItem)).then(() => dispatch(refresh()));
  };

  const handleChangeQuantity = (id, delta) => {
    const existingItem = cartItems.find((item) => item.id === id);
    if (!existingItem || (delta === -1 && existingItem.quantity <= 1)) return;

    const updatedItem = { priceId: existingItem.priceId, quantity: delta };
    const action = token ? updateCartUser : updateCartGuest;
    const refresh = token ? getCartUser : getCartGuest;

    dispatch(action(updatedItem)).then(() => dispatch(refresh()));
  };

  const handleOrder = () => {
    if (token) {
      navigate('/user/orders/cart', { state: { cartItems, totalPrice, selectedVouchers, discountAmount } });
    } else {
      navigate('/orders/cart', { state: cartItems });
    }
  };

  return (
    <div>
      <Header />
      <div className="container px-4 md:px-8 lg:px-48 mx-auto my-10 min-h-[400px]">
        <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>

        {loading ? (
          <p>Đang tải giỏ hàng...</p>
        ) : cartItems.length > 0 ? (
          <div className="lg:w-4/5 w-full">
            <div className="grid grid-cols-9 gap-6">
              <div className="col-span-4 font-medium">Sản phẩm</div>
              <div className="font-medium col-span-2 text-center">Đơn giá</div>
              <div className="font-medium col-span-2 text-center">Số lượng</div>
              <div className="font-medium"></div>

              <div className="col-span-9 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-9 items-center border-b pb-4">
                    <div className="flex items-center space-x-4 col-span-4">
                      <img src={item.image} alt={item.productName} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <h3 className="font-medium">{item.productName}</h3>
                        <p>{item.unitName}</p>
                      </div>
                    </div>

                    <div className="text-center col-span-2">
                      <p>{item.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
                    </div>

                    <div className="flex items-center justify-center space-x-2 col-span-2">
                      <button onClick={() => handleChangeQuantity(item.id, -1)} className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-medium py-1 px-2 rounded-full">-</button>
                      <input type="text" value={item.quantity} className="w-12 text-center border-none focus:outline-none" readOnly />
                      <button onClick={() => handleChangeQuantity(item.id, 1)} className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-medium py-1 px-2 rounded-full">+</button>
                    </div>

                    <div className="text-center">
                      <button className="text-red-500" onClick={() => handleRemoveItem(item.id)}>
                        <FaRegTrashCan />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tổng cộng + Mã giảm giá */}
            <div className="fixed lg:w-1/5 rounded border border-inherit p-6 top-40 right-20">
              <div className="cursor-pointer flex justify-between items-center pb-3 border-b border-gray-200" onClick={() => setIsDialogOpen(true)}>
                <div className="flex items-center">
                  <HiOutlineTicket className="text-xl text-blue-700" />
                  <p className="ml-2 text-sm font-medium">Mã giảm giá</p>
                </div>
                <IoIosArrowForward />
              </div>

              {Object.values(selectedVouchers).map(voucher => (
                voucher && (
                  <div key={voucher.id} className="mt-2 flex justify-between items-center bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 shadow-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-300 rounded-l-lg" />
                    <div className="flex items-center space-x-2 z-10">
                      <div className="bg-white text-orange-500 rounded-full p-1.5 flex items-center justify-center shadow-sm">
                        <FaTicketAlt className="h-4 w-4" />
                      </div>
                      <p className="text-xs font-medium text-orange-700">{voucher.name}</p>
                    </div>
                    <button
                      onClick={() => {
                        const updated = { ...selectedVouchers };
                        delete updated[voucher.couponType];
                        setSelectedVouchers(updated);
                      }}
                      className="text-[10px] text-red-500 hover:text-red-700 font-medium z-10"
                    >
                      Hủy
                    </button>
                  </div>
                )
              ))}

              <div className="flex justify-between items-center my-4">
                <p>Tạm tính:</p>
                <p>{totalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <p>Giảm giá:</p>
                <p className="text-red-500">
                  - {discountAmount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                </p>
              </div>
              <div className="flex justify-between items-center mt-4 mb-6">
                <p className="text-lg font-medium">Thành tiền:</p>
                <p className="text-xl font-semibold text-red-500">
                  {(totalPrice - discountAmount).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                </p>
              </div>
              <button className="bg-sky-500 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded w-full" onClick={handleOrder}>
                Thanh toán
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Giỏ hàng trống</h2>
            <a href="/" className="bg-sky-500 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded">
              Tiếp tục mua hàng
            </a>
          </div>
        )}

        <VoucherDialog 
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          vouchers={coupons}
          totalPrice={totalPrice}
          onSelectVoucher={(voucherObj) => {
            setSelectedVouchers(voucherObj);
          }}
        />

      </div>
      <Footer />
    </div>
  );
};

export default Cart;
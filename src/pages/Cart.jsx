import React, { useEffect } from "react";
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
  transfer
} from "../store/Reducers/cartReducer";
import { FaRegTrashCan } from "react-icons/fa6";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems, totalPrice, loading, message } = useSelector((state) => state.cart);
  const token = localStorage.getItem('token');

  console.log(token)
  useEffect(() => {
    if (token) {
      dispatch(transfer())
      dispatch(getCartUser());
      console.log('gio hang user')
    } else {
      dispatch(getCartGuest()); // Gọi API lấy giỏ hàng cho khách
    }
  }, [dispatch, token]);

  const handleRemoveItem = (id) => {
    const existingItem = cartItems.find((item) => item.id === id);
    if (existingItem) {
      const deleteItem = { cartItemId: id };

      if (token) {
        dispatch(deleteCartUser(deleteItem)) // API xóa sản phẩm của người dùng
          .then(() => dispatch(getCartUser()));
      } else {
        dispatch(deleteCartGuest(deleteItem)) // API xóa sản phẩm của khách
          .then(() => dispatch(getCartGuest()));
      }
    }
  };

  const handleIncreaseQuantity = (id) => {
    const existingItem = cartItems.find((item) => item.id === id);
    if (existingItem) {
      const updatedItem = { priceId: existingItem.priceId, quantity: 1 };

      if (token) {
        dispatch(updateCartUser(updatedItem)) // API cập nhật số lượng cho người dùng
          .then(() => dispatch(getCartUser()));
      } else {
        dispatch(updateCartGuest(updatedItem)) // API cập nhật số lượng cho khách
          .then(() => dispatch(getCartGuest()));
      }
    }
  };

  const handleDecreaseQuantity = (id) => {
    const existingItem = cartItems.find((item) => item.id === id);
    if (existingItem && existingItem.quantity > 1) {
      const updatedItem = { priceId: existingItem.priceId, quantity: -1 };

      if (token) {
        dispatch(updateCartUser(updatedItem)) // API giảm số lượng cho người dùng
          .then(() => dispatch(getCartUser()));
      } else {
        dispatch(updateCartGuest(updatedItem)) // API giảm số lượng cho khách
          .then(() => dispatch(getCartGuest()));
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="container px-4 md:px-8 lg:px-48 container mx-auto my-10 h-[500px]">
        <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>
        {loading ? (
          <p>Đang tải giỏ hàng...</p>
        ) : cartItems.length > 0 ? (
          <div className="lg:w-4/5 w-full">
            <div className="grid grid-cols-9 gap-6">
              {/* Tiêu đề cột */}
              <div className="col-span-4 font-medium">Sản phẩm</div>
              <div className="font-medium col-span-2 text-center">Đơn giá</div>
              <div className="font-medium col-span-2 text-center">Số lượng</div>
              <div className="font-medium"></div>

              {/* Danh sách các sản phẩm */}
              <div className="col-span-9 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="grid grid-cols-9 items-center border-b pb-4">
                    {/* Cột Sản phẩm */}
                    <div className="flex items-center space-x-4 col-span-4">
                      <img
                        src={token ? item.image : item.url}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium">{item.productName}</h3>
                        <p>{item.unitName}</p>
                      </div>
                    </div>

                    {/* Cột Đơn giá */}
                    <div className="text-center col-span-2">
                      <p>
                        {item.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                    </div>

                    {/* Cột Số lượng */}
                    <div className="flex items-center justify-center space-x-2 col-span-2">
                      <button
                        onClick={() => handleDecreaseQuantity(item.id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-medium py-1 px-2 rounded-full"
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        className="w-12 text-center border-none focus:outline-none"
                        readOnly
                      />
                      <button
                        onClick={() => handleIncreaseQuantity(item.id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-medium py-1 px-2 rounded-full"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-center">
                      <button
                        className="text-red-500"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <FaRegTrashCan />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tổng cộng */}
            <div className="fixed lg:w-1/5 rounded border border-inherit p-6 top-40 right-20">
              <h2 className="text-xl font-bold mb-4">Tổng Cộng</h2>
              <div className="flex justify-between items-center mb-4">
                <p>Tạm tính:</p>
                <p className="font-medium">
                  {totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
              <div className="flex justify-between items-center mb-4">
                <p>Giảm giá:</p>
                <p className="font-medium">- 0 VND</p>
              </div>
              <div className="flex justify-between items-center mb-6">
                <p>Thành tiền:</p>
                <p className="font-medium">
                  {totalPrice.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
              <button className="bg-sky-500 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded w-full">
                Thanh toán
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Giỏ hàng trống</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            <a
              href="/"
              className="bg-sky-500 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded"
            >
              Tiếp tục mua hàng
            </a>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;

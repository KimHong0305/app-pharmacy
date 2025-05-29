import addressReducer from "./Reducers/addressReducer";
import authReducer from "./Reducers/authReducer";
import cartReducer from "./Reducers/cartReducer";
import categoryReducer from "./Reducers/categoryReducer";
import companyReducer from "./Reducers/companyReducer";
import couponReducer from "./Reducers/couponReducer";
import dashboardReducer from "./Reducers/dashboardReducer";
import feedbackEmployeeReducer from "./Reducers/feedback/feedbackEmployeeReducer";
import feedbackReducer from "./Reducers/feedback/feedbackReducer";
import locationReducer from "./Reducers/locationReducer";
import orderAdminReducer from "./Reducers/order/orderAdminReducer";
import orderGuestReducer from "./Reducers/order/orderGuestReducer";
import orderUserReducer from "./Reducers/order/orderUserReducer";
import MoMoReducer from "./Reducers/payment/MoMoReducer";
import VNPayReducer from "./Reducers/payment/VNPayReducer";
import ZaloPayReducer from "./Reducers/payment/ZaloPayReducer";
import priceReducer from "./Reducers/priceReducer";
import productReducer from "./Reducers/productReducer";
import unitReducer from "./Reducers/unitReducer";
import userReducer from "./Reducers/userReducer";
import homeReducer from "./Reducers/homeReducer";
import deliveryReducer from "./Reducers/deliveryReducer";
import callbackReducer from "./Reducers/payment/callbackReducer";
import chatUserReducer from "./Reducers/chat/chatUserReducer";
import chatNurseReducer from "./Reducers/chat/chatNurseReducer";

const rootReducer = {
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
    cart: cartReducer,
    user: userReducer,
    unit: unitReducer,
    company: companyReducer,
    price: priceReducer,
    location: locationReducer,
    address: addressReducer,
    vnPay: VNPayReducer,
    orderUser: orderUserReducer,
    momo: MoMoReducer,
    zaloPay: ZaloPayReducer,
    orderAdmin: orderAdminReducer,
    orderGuest: orderGuestReducer,
    feedbackEmployee: feedbackEmployeeReducer,
    feedback: feedbackReducer,
    dashboard: dashboardReducer,
    coupon: couponReducer,
    home: homeReducer,
    delivery: deliveryReducer,
    callback: callbackReducer,
    chat_user: chatUserReducer,
    chat_nurse: chatNurseReducer,
}
export default rootReducer;
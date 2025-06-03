import { createPaymentVNPay } from "../store/Reducers/payment/VNPayReducer";
import { createPaymentMoMo } from "../store/Reducers/payment/MoMoReducer";
import { createPaymentZaloPay } from "../store/Reducers/payment/ZaloPayReducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const usePaymentRedirect = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRedirectPayment = async (method, orderId) => {
        try {
            let data;

            switch (method) {
                case "VNPAY":
                    data = await dispatch(createPaymentVNPay(orderId)).unwrap();
                    if (data.result) {
                        window.location.href = data.result;
                    } else {
                        toast.error("Không tạo được thanh toán VNPay.");
                    }
                    break;

                case "MOMO":
                    data = await dispatch(createPaymentMoMo(orderId)).unwrap();
                    if (data.result) {
                        window.location.href = data.result.payUrl;
                    } else {
                        toast.error("Không tạo được thanh toán Momo.");
                    }
                    break;

                case "ZALOPAY":
                    data = await dispatch(createPaymentZaloPay(orderId)).unwrap();
                    if (data.result) {
                        window.location.href = data.result.orderurl;
                    } else {
                        toast.error("Không tạo được thanh toán ZaloPay.");
                    }
                    break;

                default:
                    navigate('/');
                    break;
            }
        } catch (error) {
            console.error(`Error creating ${method} payment:`, error);
            toast.error(`Đã xảy ra lỗi khi tạo thanh toán ${method}.`);
        }
    };

    return handleRedirectPayment;
};

export default usePaymentRedirect;

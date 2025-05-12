import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getService, getServiceFee } from "../store/Reducers/deliveryReducer";
import { useDispatch, useSelector } from "react-redux";

const ShippingMethodSelector = ({ shippingMethod, setShippingMethod, districtId, wardCode, total, setShippingFee, setService }) => {
    const dispatch = useDispatch();
    const { service, fee } = useSelector((state) => state.delivery);

    useEffect(() => {
        const fetchServices = async () => {
            if (districtId && wardCode && total !== undefined) {
                try {
                    const result = await dispatch(getService(districtId)).unwrap();
                    if (Array.isArray(result) && result.length > 0 && result[0].service_id) {
                        const info = {
                            service_id: result[0].service_id,
                            to_district_id: districtId,
                            to_ward_code: String(wardCode),
                            insurance_value: 0,
                        };
                        await dispatch(getServiceFee(info)).unwrap();
                    } else {
                        console.warn("Không tìm thấy service_id hợp lệ trong kết quả getService.");
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy dịch vụ giao hàng:", error);
                }
            }
        };

        fetchServices();
    }, [districtId, wardCode, total, dispatch]);

    useEffect(() => {
        if (fee.total) {
            setShippingFee(fee.total);
            setService(service[0].service_id)
        }
    }, [fee]);

    // console.log(fee)

    const handleSelectShippingMethod = (method) => {
        if (method === "EXPRESS") {
            toast.error("Khu vực không hỗ trợ giao hàng hỏa tốc");
            return
        }
        setShippingMethod(method);
    };

    return (
        <div className="mt-6">
            <ToastContainer />
            <h2 className="text-lg font-bold mb-4">Phương thức vận chuyển</h2>
            <div className="flex items-center gap-6">
                <div
                    className={`flex items-center p-2 border rounded cursor-pointer ${
                        shippingMethod === "FAST" ? "bg-blue-100 border-blue-400" : "bg-gray-100"
                    }`}
                    onClick={() => handleSelectShippingMethod("FAST")}
                >
                    <input
                        type="radio"
                        name="shipping-method"
                        value="FAST"
                        checked={shippingMethod === "FAST"}
                        onChange={() => handleSelectShippingMethod("FAST")}
                        className="mr-2"
                    />
                    <label>Giao hàng nhanh</label>
                </div>
                <div
                    className={`flex items-center p-2 border rounded cursor-pointer ${
                        shippingMethod === "EXPRESS" ? "bg-blue-100 border-blue-400" : "bg-gray-100"
                    }`}
                    onClick={() => handleSelectShippingMethod("EXPRESS")}
                >
                    <input
                        type="radio"
                        name="shipping-method"
                        value="EXPRESS"
                        checked={shippingMethod === "EXPRESS"}
                        onChange={() => handleSelectShippingMethod("EXPRESS")}
                        className="mr-2"
                    />
                    <label>Giao hàng hỏa tốc</label>
                </div>
            </div>
        </div>
    );
};

export default ShippingMethodSelector;

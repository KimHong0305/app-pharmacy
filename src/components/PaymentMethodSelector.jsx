import React from "react";

const PaymentMethodSelector = ({ paymentMethod, onChange }) => {
    const methods = [
        { id: "CASH", name: "Tiền mặt", img: "/images/COD.png" },
        { id: "MOMO", name: "Momo", img: "/images/MoMo.webp" },
        { id: "VNPAY", name: "VNPay", img: "/images/VNPay.jpg" },
        { id: "ZALOPAY", name: "ZaloPay", img: "/images/ZaloPay.png" },
    ];

    return (
        <div className="mt-6">
            <h2 className="text-lg font-bold mb-4">Phương thức thanh toán</h2>
            {methods.map(method => (
                <div className="flex items-center mt-4" key={method.id}>
                    <input
                        type="radio"
                        id={`payment-${method.id.toLowerCase()}`}
                        name="payment-method"
                        value={method.id}
                        className="mr-2"
                        onChange={onChange}
                        checked={paymentMethod === method.id}
                    />
                    <label htmlFor={`payment-${method.id.toLowerCase()}`} className="flex items-center p-2">
                        <img className="w-[40px] h-[40px] rounded overflow-hidden" src={method.img} alt={method.name} />
                        <p className="ml-4">{method.name}</p>
                    </label>
                </div>
            ))}
        </div>
    );
};

export default PaymentMethodSelector;
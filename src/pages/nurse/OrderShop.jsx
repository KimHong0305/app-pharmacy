import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { confirmOrder, createOrderShop, getUsersByPhone } from '../../store/Reducers/nurseReducer';
import { CiSearch } from "react-icons/ci";
import { getAllProducts } from '../../store/Reducers/productReducer';
import { FaSearch } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { toast } from 'react-toastify';
import { createPaymentMoMo } from '../../store/Reducers/payment/MoMoReducer';

const OrderShop = () => {
    const [phone, setPhone] = useState('');
    const [customer, setCustomer] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedUnitIndex, setSelectedUnitIndex] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const { info } = useSelector((state) => state.nurse);
    const products = useSelector((state) => state.product.allProducts);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllProducts(0, 300));
    },[dispatch])

    useEffect(() => {
        if (searchQuery.trim() === '') {
          setFilteredProducts([]);
        } else {
          const results = products.filter(
            (product) =>
              product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFilteredProducts(results);
        }
    }, [searchQuery, products]);

    const handleSearch = async () => {
        if (!phone) return;

        setCustomer(null);

        try {
            await dispatch(getUsersByPhone(phone)).unwrap();
            setCustomer(info);
        } catch (error) {
            console.error("Lỗi gửi tin nhắn:", error);
        }
    };

    const handleRemoveItem = (product) => {
        setCartItems((prev) => prev.filter((p) => p.priceId !== product.priceId));
    };

    const handleUpdateQuantity = (product, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems((prev) =>
            prev.map((p) =>
                p.priceId === product.priceId ? { ...p, quantity: newQuantity } : p
            )
        );
    };

    const handleOrder = async () => {
        if (!customer || cartItems.length === 0 || !paymentMethod) {
            toast.error("Vui lòng nhập đầy đủ thông tin khách hàng, sản phẩm và phương thức thanh toán.");
            return;
        }

        const payload = {
            phone: customer.phoneNumber,
            listPrices: cartItems.map(item => ({
            id: item.priceId,
            quantity: item.quantity
            })),
            paymentMethod: paymentMethod
        };
        // console.log(payload)

        try {
            const result = await dispatch(createOrderShop(payload)).unwrap();
            console.log("Tạo đơn hàng thành công:", result);
            setCustomer('');
            setPhone('');
            setCartItems([]);
            setPaymentMethod('CASH');
            toast.success("Tạo đơn hàng thành công!");
            if (result.paymentMethod === "MOMO") {
                try {
                    const data = await dispatch(createPaymentMoMo(result.id)).unwrap();
                    if (data.result) {
                        window.location.href = data.result.payUrl;
                    } else {
                        toast.error("Không tạo được thanh toán Momo.");
                    }
                } catch (error) {
                    console.error("Error creating Momo payment:", error);
                    toast.error("Đã xảy ra lỗi khi tạo thanh toán Momo.");
                }
            } else if (result.paymentMethod === "CASH") {
                try {
                    const confirm = {
                        confirm: true,
                        orderId: result.id,
                    }
                    await dispatch(confirmOrder(confirm)).unwrap();
                } catch (error) {
                    console.error("Error creating cash payment:", error);
                    toast.error("Đã xảy ra lỗi khi tạo thanh toán.");
                }
            }
        } catch (error) {
            console.error("Lỗi tạo đơn hàng:", error);
            toast.error("Tạo đơn hàng thất bại");
        }
    };

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="px-2 md:px-4 flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-2/5 flex flex-col p-4 rounded bg-white shadow-lg justify-between">
                <h2 className="text-black text-2xl font-bold">Tạo đơn hàng</h2>
                {!customer && (
                    <div className="w-full mx-auto mt-2">
                        <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={phone}
                            placeholder="Nhập số điện thoại khách hàng"
                            onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                                setPhone(value);
                            }
                            }}
                            className="border p-2 rounded flex-1"
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            onClick={handleSearch}
                            className="bg-blue-500 text-white w-10 h-10 flex items-center justify-center rounded hover:bg-blue-600"
                        >
                            <CiSearch size={20} />
                        </button>
                        </div>
                    </div>
                )}

                {customer && (
                    <div className="pt-2 mt-2 border-t">
                        <div className="flex items-center justify-between ">
                            <h2 className="font-medium">Thông tin khách hàng</h2>
                            <button
                                onClick={() => {
                                setCustomer('');
                                setPhone('');
                                }}
                                className="text-sm text-blue-500 hover:underline"
                            >
                                Đổi số điện thoại
                            </button>
                        </div>
                        <div className='flex justify-between items-center text-sm py-1'>
                            <p>Họ tên: </p>
                            <p className='font-medium'> {customer.lastname} {customer.firstname} </p>
                        </div>
                        <div className='flex justify-between items-center text-sm py-1'>
                            <p> Số điện thoại: </p>
                            <p className='font-medium'> {customer.phoneNumber} </p>
                        </div>
                    </div>
                )}

                <div className="pt-2 mt-2 border-t h-[330px]">
                    <h2 className="font-medium">Sản phẩm</h2>
                    {cartItems.length === 0 ? (
                        <p className="text-gray-500">Chưa có sản phẩm nào được chọn.</p>
                    ) : (
                        <>
                        <ul className="space-y-2 h-[250px] overflow-y-auto mt-2">
                        {cartItems.map((item, index) => (
                            <li key={index} className="flex items-center justify-between border p-2 rounded">
                                <div className="flex items-center gap-3">
                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded" />
                                    <div>
                                        <p className="font-medium text-sm truncate max-w-[300px] mb-1">{item.name}</p>
                                        <p className='border border-slate-300 text-xs font-medium w-10 py-1 px-2 rounded-md bg-sky-100 text-sky-950 mb-1'>
                                            {item.unit}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            {item.price.toLocaleString("vi-VN")} đ
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end justify-between gap-2 min-h-[60px]">
                                    {/* Nút xóa */}
                                    <button
                                        className="text-red-500 hover:text-red-600"
                                        onClick={() => handleRemoveItem(item)}
                                    >
                                        <FaRegTrashCan size={16} />
                                    </button>

                                    {/* Tăng giảm số lượng */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                                            className="w-6 h-6 flex items-center justify-center text-sm border rounded-full hover:bg-gray-100"
                                            disabled={item.quantity <= 1}
                                        >
                                            -
                                        </button>

                                        <span className="min-w-[20px] text-sm text-center">{item.quantity}</span>

                                        <button
                                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                            className="w-6 h-6 flex items-center justify-center text-sm border rounded-full hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                        </ul>
                        <div className="flex justify-between items-center mt-2 text-right font-semibold text-sm">
                            <p>{totalQuantity} sản phẩm</p>
                            <p>
                                Tổng tiền: 
                                <span className='ml-2 text-lg text-blue-500'>{totalPrice.toLocaleString('vi-VN')} đ</span>
                            </p>
                        </div>
                        </>
                    )}
                </div>

                <div className="pt-2 border-t mt-2">
                    <h2 className="font-medium mb-2">Phương thức thanh toán</h2>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="payment"
                                value="CASH"
                                checked={paymentMethod === 'CASH'}
                                onChange={() => setPaymentMethod('CASH')}
                                className="cursor-pointer"
                            />
                            <img className="w-[20px] h-[20px] rounded overflow-hidden" src="/images/COD.png" alt="Tiền mặt"/>
                            <p className="ml-1 text-sm">Tiền mặt</p>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="payment"
                                value="MOMO"
                                checked={paymentMethod === 'MOMO'}
                                onChange={() => setPaymentMethod('MOMO')}
                                className="cursor-pointer"
                            />
                            <img className="w-[20px] h-[20px] rounded overflow-hidden" src="/images/MoMo.webp"  alt="Momo"/>
                            <p className="ml-1 text-sm">Momo</p>
                        </label>
                    </div>
                </div>

                <div className=" flex justify-end">
                    <button className="h-10 w-32 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow-md transition duration-300 flex items-center justify-center"
                        onClick={() => setShowConfirmDialog(true)}
                    >
                        Tạo đơn
                    </button>
                </div>
            </div>

            <div className="w-full md:w-3/5 flex flex-col p-4 rounded bg-white shadow-lg h-[600px]">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-full bg-white">
                    <input  
                        type="text" 
                        placeholder="Tìm kiếm sản phẩm" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={(e) => {
                            if (e.relatedTarget?.classList?.contains('Tra cứu đơn hàng')) {
                                return;
                            }
                    }}
                        className="flex-1 p-2 focus:outline-none" 
                    />
    
                    <button className="p-2">
                        <FaSearch />
                    </button>
                </div>
                <div className="mt-4 w-full max-h-[500px] overflow-y-auto pr-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col items-center justify-between border border-gray-200 hover:shadow-xl bg-white rounded-lg p-3 cursor-pointer transition-all duration-300 min-w-[160px] max-w-[230px] w-full mx-auto"
                            onClick={() => {
                                setSelectedProduct(item);
                                setQuantity(1);
                            }}
                        >
                            <img
                                className="w-full aspect-[4/3] object-contain rounded-md bg-white"
                                src={item.image}
                                alt={item.name}
                            />
                            <span className="mt-2 font-medium text-center line-clamp-2 text-sm text-gray-800">
                                {item.name}
                            </span>
                            <span className="mt-1 font-semibold text-sky-600 text-base">
                                {item.prices?.[0]?.price?.toLocaleString("vi-VN")} đ /{" "}
                                {item.prices?.[0]?.unit?.name}
                            </span>
                        </div>
                        ))
                    ) : (
                        <p className="text-center col-span-full"></p>
                    )}
                    </div>
                    {selectedProduct && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
                                <button
                                    className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
                                    onClick={() => setSelectedProduct(null)}
                                >
                                    &times;
                                </button>

                                {/* Ảnh và Tên sản phẩm */}
                                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full rounded-md aspect-[4/3] object-contain mb-4" />
                                <h2 className="font-medium">{selectedProduct.name}</h2>

                                {/* Chọn đơn vị */}
                                <div className="flex flex-wrap gap-2 my-2 justify-center">
                                    {selectedProduct?.prices.map((p, index) => (
                                        p.unit?.name && (
                                        <button
                                            key={`unit-${index}`}
                                            className={`border border-slate-300 hover:bg-slate-200 text-xs font-medium w-16 py-2 px-4 rounded-lg ${
                                            selectedUnitIndex === index ? 'bg-sky-100 text-sky-950' : ''
                                            }`}
                                            onClick={() => setSelectedUnitIndex(index)}
                                            type="button"
                                        >
                                            {p.unit.name}
                                        </button>
                                        )
                                    ))}
                                </div>
                                
                                {/* Giá hiển thị */}
                                <p className="mt-2 font-semibold text-sky-600 text-center">
                                    {selectedProduct.prices[selectedUnitIndex]?.price?.toLocaleString("vi-VN")} đ / {selectedProduct.prices[selectedUnitIndex]?.unit?.name}
                                </p>

                                {/* Chọn số lượng */}
                                <div className="mt-3 flex items-center gap-2 justify-center">
                                    <label htmlFor="quantity" className="font-medium text-sm">Số lượng:</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="border p-1 rounded w-20"
                                    />
                                </div>

                                {/* Nút thêm */}
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => {
                                            const selectedPrice = selectedProduct.prices[selectedUnitIndex];
                                            const productToAdd = {
                                                image: selectedProduct.image,
                                                name: selectedProduct.name,
                                                priceId: selectedPrice.id,
                                                price: selectedPrice.price,
                                                quantity: quantity,
                                                unit: selectedPrice.unit.name,
                                            };
                                            setCartItems(prev => {
                                                const index = prev.findIndex(item => item.priceId === productToAdd.priceId);
                                                if (index !== -1) {
                                                    const updated = [...prev];
                                                    updated[index].quantity += productToAdd.quantity;
                                                    return updated;
                                                }
                                                return [...prev, productToAdd];
                                            });

                                            setSelectedProduct(null);
                                        }}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Thêm vào đơn
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
            {showConfirmDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">Xác nhận đặt hàng</h2>
                <p className="text-sm text-gray-600 mb-6">
                    Bạn có chắc chắn muốn tạo đơn hàng này không?
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setShowConfirmDialog(false)}
                        className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => {
                            setShowConfirmDialog(false);
                            handleOrder();
                        }}
                        className="px-4 py-2 text-sm bg-sky-600 hover:bg-sky-700 text-white rounded"
                    >
                        Xác nhận
                    </button>
                </div>
                </div>
            </div>
            )}
        </div>
    );
};

export default OrderShop;

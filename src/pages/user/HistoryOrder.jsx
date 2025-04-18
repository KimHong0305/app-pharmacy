import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from '../../store/Reducers/authReducer';
import { useNavigate } from 'react-router-dom';
import { getHistory } from '../../store/Reducers/order/orderUserReducer';
import { createFeedback, deleteFeedback, getFeedbackByUser, updateFeedback } from '../../store/Reducers/feedback/feedbackReducer';
import { toast } from 'react-toastify';
import { FaRegTrashCan } from "react-icons/fa6";
import { GrEdit } from "react-icons/gr";
import UserNavBar from '../../components/UserNavBar';

const HistoryOrder = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { bio } = useSelector((state) => state.auth);   
    const { history } = useSelector((state) => state.orderUser);
    const { feedbackUser } = useSelector((state) => state.feedback);

    const [activeTab, setActiveTab] = useState("processing");
    const [showReviewDialog, setShowReviewDialog] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [feedbackToDelete, setFeedbackToDelete] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [updatedFeedback, setUpdatedFeedback] = useState("");

    useEffect(() => {
        dispatch(getUserInfo());
        dispatch(getHistory());
        dispatch(getFeedbackByUser());
    }, [dispatch]);

    const handleAddress = () => {
        navigate('/address');
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    const handleCoupon = () => navigate('/coupon');

    const handleOpenReviewDialog = (order) => {
        setSelectedOrder(order);
        setSelectedProduct(order.orderItemResponses[0] || null);
        setShowReviewDialog(true);
    };

    const handleCloseReviewDialog = () => {
        setReviewText("");
        setSelectedProduct(null);
        setShowReviewDialog(false);
    };

    const handleSubmitReview = async () => {
        const newFeedback = {
            productId: selectedProduct.productId,
            priceId: selectedProduct.priceId,
            feedback: reviewText
        }
        console.log(newFeedback)
        try {
            await dispatch(createFeedback(newFeedback)).unwrap();
            toast.success('Feedback sản phẩm thành công!')
            dispatch(getFeedbackByUser());
            handleCloseReviewDialog();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = (Id) => {
        setFeedbackToDelete(Id);
        setIsDeleteDialogOpen(true);
    };
    
    const handleConfirmDelete = async () => {
        if (feedbackToDelete) {
            await dispatch(deleteFeedback(feedbackToDelete));
            dispatch(getFeedbackByUser());
            toast.success('Xóa feedback thành công');
            setFeedbackToDelete(null);
            setIsDeleteDialogOpen(false);
        }
    };
    
    const handleCancelDelete = () => {
        setFeedbackToDelete(null);
        setIsDeleteDialogOpen(false);
    };

    const handleUpdateClick = (feedbackId) => {
        setSelectedFeedback(feedbackId);
        setShowEditDialog(true);
    };
    

    const handleSubmitUpdate = async (feedbackId) => {
        const update = {
            id: feedbackId, 
            feedback: updatedFeedback
        }
        //console.log(update)
        try {
            await dispatch(updateFeedback(update)).unwrap();
            toast.success("Cập nhật đánh giá thành công!");
            setShowEditDialog(false);
            setUpdatedFeedback("");
            dispatch(getFeedbackByUser());
        } catch (error) {
            toast.error("Cập nhật đánh giá thất bại!");
        }
    };
    

    const filteredHistory = history.filter((order) => {
        switch (activeTab) {
            case "processing":
                return !order.isConfirm  &&  (order.status === "SUCCESS" || order.paymentMethod === "CASH");
            case "shipping":
                return order.isConfirm && order.status !== "CANCELLED";
            case "cancelled":
                return order.status === "FAILED" && !order.isConfirm;
            case "pendingPayment":
                return order.status === "PENDING" && order.paymentMethod !== "CASH";
            case "review":
                return order.isConfirm  &&  (order.status === "SUCCESS" || order.paymentMethod === "CASH");
            case "reviewed":
                return false;
            default:
                return true;
        }
    });

    const filteredFeedbacks = activeTab === "reviewed" ? feedbackUser : [];

    if (!bio) {
        return <div>No user information available.</div>;
    }

    const handleOrderDetail= (order) => {
        navigate('/orderDetail', { state: order });
    };
    
    return (
        <div>
            <Header />
            <div className="bg-slate-100 py-10">
                <div className="px-4 md:px-8 lg:px-48 container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className='md:col-span-1 space-y-8'>
                            <UserNavBar 
                                bio={bio} 
                                handleProfile={handleProfile} handleAddress={handleAddress} handleCoupon ={handleCoupon}
                            />
                        </div>
                        <div className='md:col-span-3 flex flex-col items-center justify-start'>
                            <div className="w-full bg-white rounded-lg shadow-xl flex flex-col items-center justify-center py-5 px-10">
                                <p className='mb-4 text-2xl font-semibold'>LỊCH SỬ MUA HÀNG</p>

                                {/* Thanh Tab */}
                                <div className="w-full bg-sky-100 rounded-md flex justify-around mb-4">
                                    {[
                                        { label: "Đang xử lý", value: "processing" },
                                        { label: "Đang giao", value: "shipping" },
                                        { label: "Đã hủy", value: "cancelled" },
                                        { label: "Chờ thanh toán", value: "pendingPayment" },
                                        { label: "Đánh giá", value: "review" },
                                        { label: "Đã đánh giá", value: "reviewed" },
                                    ].map((tab) => (
                                        <button
                                            key={tab.value}
                                            onClick={() => setActiveTab(tab.value)}
                                            className={`py-2 px-4 text-sm font-medium ${
                                                activeTab === tab.value
                                                    ? "text-blue-600 border-b-2 border-blue-600"
                                                    : "text-gray-600 hover:text-blue-600"
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {activeTab === "reviewed" && (
                                    <div className="w-full">
                                        {filteredFeedbacks.length === 0 ? (
                                            <div className="text-center py-10">
                                                <p>Không có đánh giá nào.</p>
                                            </div>
                                        ) : (
                                            filteredFeedbacks.map((feedback) => (
                                                <div key={feedback.id} className="border p-4 rounded-md shadow-sm bg-gray-50 b-5">
                                                     <div className='mb-2 p-2 bg-gray-200 rounded-lg'>
                                                        <p className="text-sm font-medium text-gray-700">
                                                            {feedback.productName}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className='flex items-center'>
                                                            <img
                                                                src={feedback.avatar || "http://localhost:3000/images/avata_khach.jpg"}
                                                                alt={feedback.username}
                                                                className="w-10 h-10 rounded-full mr-3"
                                                            />
                                                            <p className="font-semibold">{feedback.username}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">{feedback.createDate}</p>
                                                        </div>
                                                    </div>
                                                    <div className='flex justify-between'>
                                                        <p className="mt-1 text-sm text-gray-600">
                                                            {feedback.feedback}
                                                        </p>
                                                        <div className='flex'>
                                                            <button className="flex items-center justify-center p-2 rounded-lg bg-green-200 ml-2"
                                                                onClick={() => handleUpdateClick(feedback.id)}
                                                            >
                                                                <GrEdit className="text-green-500" />
                                                            </button>
                                                            <button className="flex items-center justify-center p-2 rounded-lg bg-red-200 ml-2"
                                                                onClick={() => handleDelete(feedback.id)}
                                                            >
                                                                <FaRegTrashCan className="text-red-500" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {/* Nội dung hiển thị dựa trên tab */}
                                {filteredHistory.length === 0 && activeTab !== "reviewed" ? (
                                    <div className="text-center py-10">
                                        <p>Không có đơn hàng nào.</p>
                                    </div>
                                ) : (
                                    filteredHistory.map((order) => (
                                        <div key={order.id} className="w-full py-4">
                                            {/* Nội dung đơn hàng */}
                                            <div className="p-4 bg-white border border-gray-200 rounded-lg">
                                            <div className="flex justify-between pb-2 border-b border-gray-200 items-center">
                                                <div>
                                                    <p className="text-lg font-semibold cursor-pointer" onClick={() => handleOrderDetail(order)}>Mã đơn hàng: {order.id}</p>
                                                    <p className="text-sm text-gray-600">Ngày đặt: {order.orderDate}</p>
                                                </div>
                                                {order.status !== 'FAILED' && (
                                                    <span
                                                        className={`px-3 py-1 text-sm rounded-lg ${
                                                            order.isConfirm === false ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-200 text-blue-800'
                                                        }`}
                                                    >
                                                        {order.isConfirm === false ? 'Đang xử lý' : 'Đang giao hàng'}
                                                    </span>
                                                )}

                                            </div>

                                            <div className="mt-4 border-b border-gray-200">
                                            {order.orderItemResponses.length > 0 && (
                                                <div className="flex py-2">
                                                <div className="w-1/6">
                                                    <img
                                                    src={order.orderItemResponses[0].image}
                                                    alt={order.orderItemResponses[0].productName}
                                                    className="w-full h-auto object-cover"
                                                    />
                                                </div>
                                                <div className="w-5/6 flex flex-col justify-between">
                                                    <div>
                                                        <p className="font-medium">{order.orderItemResponses[0].productName}</p>
                                                        <p className="text-sm text-gray-600">
                                                        Số lượng: {order.orderItemResponses[0].quantity} {order.orderItemResponses[0].unitName}
                                                        </p>
                                                    </div>
                                                    <p className="text-sm text-gray-600">
                                                        Giá: {order.orderItemResponses[0].price.toLocaleString()} VND
                                                    </p>

                                                </div>
                                                </div>
                                            )}
                                            
                                            {/* Hiển thị số lượng sản phẩm khác */}
                                            {order.orderItemResponses.length > 1 && (
                                                <p className="my-2 text-sm text-gray-500">
                                                {order.orderItemResponses.length - 1} sản phẩm khác
                                                </p>
                                            )}
                                            </div>


                                            <div className="mt-4 flex justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        Phương thức thanh toán: <span className="font-semibold">{order.paymentMethod}</span>
                                                    </p>

                                                    {/* Hiển thị trạng thái thanh toán */}
                                                    {order.paymentMethod !== 'CASH' && (
                                                    <div className="mt-2">
                                                        <span
                                                            className={`px-3 py-1 text-sm rounded-lg ${
                                                                order.status === 'PENDING' ? 'bg-yellow-200 text-yellow-800' :
                                                                order.status === 'SUCCESS' ? 'bg-green-200 text-green-800' :
                                                                order.status === 'FAILED' ? 'bg-red-200 text-red-800' :
                                                                order.status === 'CANCELLED' ? 'bg-gray-200 text-gray-800' : ''
                                                            }`}
                                                        >
                                                            {order.status === 'PENDING' && 'Chờ xử lý'}
                                                            {order.status === 'SUCCESS' && 'Đã thanh toán'}
                                                            {order.status === 'FAILED' && 'Thanh toán thất bại'}
                                                            {order.status === 'CANCELLED' && 'Đã hủy'}
                                                        </span>
                                                    </div>
                                                    )}
                                                </div>

                                                <p className="text-lg font-semibold">
                                                    Tổng tiền: {order.totalPrice.toLocaleString()} VND
                                                </p>
                                            </div>
                                            {activeTab === "review" && (
                                                <div className="mt-4 text-right">
                                                    <button
                                                        className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                                                        onClick={() => handleOpenReviewDialog(order)}
                                                    >
                                                        Đánh giá
                                                    </button>
                                                </div>
                                            )}
                                            </div>
                                        </div>
                                    ))
                                )}
                                
                            </div>
                            {/* Dialog đánh giá */}
                            {showReviewDialog && selectedOrder && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="bg-white p-6 rounded-lg shadow-lg w-[650px]">
                                <h2 className="text-2xl font-semibold mb-2">Đánh giá sản phẩm</h2>
                                {/* Dropdown chọn sản phẩm */}
                                <label className="block text-sm mb-2">Chọn sản phẩm:</label>
                                <select
                                    className="w-full border p-2 mb-4 rounded-md"
                                    value={selectedProduct}
                                    onChange={(e) => setSelectedProduct(e.target.value)}
                                >
                                    {selectedOrder.orderItemResponses.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.productName}
                                    </option>
                                    ))}
                                </select>
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Nhập đánh giá của bạn"
                                    className="w-full p-2 border rounded-md mb-4"
                                />
                                <div className="flex justify-end space-x-2">
                                    <button
                                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                                    onClick={handleCloseReviewDialog}
                                    >
                                    Hủy
                                    </button>
                                    <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    onClick={handleSubmitReview}
                                    >
                                    Đánh giá
                                    </button>
                                </div>
                                </div>
                            </div>
                            )}

                            {isDeleteDialogOpen && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                    <div className="bg-white p-6 rounded-md shadow-lg">
                                        <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>
                                        <p className="mb-6">Bạn có chắc chắn muốn xóa feedback này không?</p>
                                        <div className="flex justify-end space-x-4">
                                            <button
                                                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                                                onClick={handleCancelDelete}
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                                                onClick={handleConfirmDelete}
                                            >
                                                Xác nhận
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {showEditDialog && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <div className="bg-white p-6 rounded-lg shadow-lg w-[650px]">
                                        <h2 className="text-2xl font-semibold mb-2">Chỉnh sửa đánh giá</h2>
                                        <textarea
                                            value={updatedFeedback}
                                            onChange={(e) => setUpdatedFeedback(e.target.value)}
                                            placeholder="Nhập đánh giá mới"
                                            className="w-full p-2 border rounded-md mb-4"
                                        />
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                                                onClick={() => setShowEditDialog(false)}
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                                onClick={() => handleSubmitUpdate(selectedFeedback)}
                                            >
                                                Cập nhật
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HistoryOrder;

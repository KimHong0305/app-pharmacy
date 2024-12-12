import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createFeedback, deleteFeedback, getAllFeedback } from '../../store/Reducers/feedback/feedbackEmployeeReducer';
import { FaRegTrashCan } from "react-icons/fa6";
import { BsReply } from "react-icons/bs";
import { toast } from 'react-toastify';

const Feedback = () => {
    const dispatch = useDispatch();

    const { allFeedback } = useSelector((state) => state.feedbackEmployee);
    const [activeReplyId, setActiveReplyId] = useState(null);
    const [replyContent, setReplyContent] = useState("");

    const [feedbackToDelete, setFeedbackToDelete] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        dispatch(getAllFeedback());
    }, [dispatch]);

    const handleReplyClick = (feedback) => {
        if (activeReplyId === feedback) {
            setActiveReplyId(null);
        } else {
            setActiveReplyId(feedback);
        }
    };

    const handleSubmitReply = async(feedback) => {
        const newFeedback = {
            productId: feedback.productId,
            feedback: replyContent,
            parent: feedback.id,
        };

        try {
            await dispatch(createFeedback(newFeedback)).unwrap();
            dispatch(getAllFeedback());
            toast.success('Reply feedback thành công!')
            setReplyContent("");
            setActiveReplyId(null);
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
            dispatch(getAllFeedback());
            toast.success('Xóa feedback thành công');
            setFeedbackToDelete(null);
            setIsDeleteDialogOpen(false);
        }
    };
    
    const handleCancelDelete = () => {
        setFeedbackToDelete(null);
        setIsDeleteDialogOpen(false);
    };

    const groupedFeedbacks = (allFeedback && Array.isArray(allFeedback)) 
    ? allFeedback.reduce((acc, feedback) => {
        if (feedback.parent) {
            if (!acc[feedback.parent.id]) {
                acc[feedback.parent.id] = [];
            }
            acc[feedback.parent.id].push(feedback);
        } else {
            acc['root'] = acc['root'] || [];
            acc['root'].push(feedback);
        }
        return acc;
        }, {})
    : { root: [] };


    return (
        <div className="px-2 md:px-4">
            <div className="flex flex-col p-4 rounded bg-white shadow-lg">
                <div className="text-black mb-4">
                    <h2 className="text-2xl font-bold mb-2">Quản lý feedback</h2>
                    <p>Đây là danh sách tất cả feedback của người dùng!!</p>
                </div>
                {/* Render Feedback List */}
                <div className="space-y-4">
                    {groupedFeedbacks.root && groupedFeedbacks.root.length > 0 ? (
                        groupedFeedbacks.root.map((feedback) => (
                            <div
                                key={feedback.id}
                                className="border p-4 rounded-md shadow-sm bg-gray-50"
                            >
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
                                            onClick={() => handleReplyClick(feedback)}
                                        >
                                            <BsReply className="text-green-500" />
                                        </button>
                                        <button className="flex items-center justify-center p-2 rounded-lg bg-red-200 ml-2"
                                            onClick={() => handleDelete(feedback.id)}
                                        >
                                            <FaRegTrashCan className="text-red-500" />
                                        </button>
                                    </div>
                                </div>

                                {/* Render child feedback (replies) */}
                                {groupedFeedbacks[feedback.id] && groupedFeedbacks[feedback.id].length > 0 && (
                                    <div className="ml-2 mt-4">
                                        {groupedFeedbacks[feedback.id].map((reply) => (
                                            <div
                                                key={reply.id}
                                                className="border p-4 rounded-md shadow-sm bg-gray-100"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className='flex items-center'>
                                                        <img
                                                            src={reply.avatar || "http://localhost:3000/images/avata_1.png"}
                                                            alt={reply.username}
                                                            className="w-10 h-10 rounded-full mr-3"
                                                        />
                                                        <p className="font-semibold">{reply.username}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-600">{reply.createDate}</p>
                                                    </div>
                                                </div>
                                                <div className='flex justify-between'>
                                                    <p className="mt-1 text-sm text-gray-600">{reply.feedback}</p>
                                                    <div className='flex'>
                                                        <button className="flex items-center justify-center p-2 rounded-lg bg-red-200 ml-2"
                                                            onClick={() => handleDelete(reply.id)}>
                                                            <FaRegTrashCan className="text-red-500" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeReplyId === feedback && (
                                    <div className='mt-3 ml-5'>
                                        <div className="flex">
                                            <img
                                                src="http://localhost:3000/images/avata_1.png"
                                                alt=""
                                                className="w-10 h-10 rounded-full mr-3"
                                            />
                                            <input
                                                type="text"
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                placeholder="Nhập câu trả lời..."
                                                className="border p-2 rounded-lg w-full"
                                            />
                                            <button
                                                className="ml-2 bg-sky-200 text-sky-600 font-semibold px-4 rounded-lg"
                                                onClick={() => handleSubmitReply(feedback)}
                                            >
                                                Gửi
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Chưa có phản hồi từ người dùng</p>
                    )}
                </div>
            </div>
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
        </div>
    );
};

export default Feedback;

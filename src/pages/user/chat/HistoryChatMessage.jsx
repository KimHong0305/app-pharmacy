import React, { useEffect, useRef, useState } from 'react';
import { GoDotFill } from 'react-icons/go';
import { useDispatch, useSelector } from 'react-redux';
import { historyChatMessage } from '../../../store/Reducers/chat/chatUserReducer';

const HistoryChatMessage = ({ roomId, receiver, image }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const dispatch = useDispatch();
    const { oldMessages } = useSelector((state) => state.chat_user);

    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        if (roomId) {
            dispatch(historyChatMessage(roomId));
        }
    }, [roomId, dispatch]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [oldMessages]);

    return (
        <div className="flex flex-col p-4 bg-white rounded-lg shadow h-[550px]">
            <div className="flex items-center gap-3 mb-4 border-b pb-4">
                <img
                    src={image}
                    alt="Nhân viên"
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                    <p className="text-lg font-semibold">{receiver}</p>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto bg-gray-50 p-4 rounded-lg shadow-inner h-[500px]">
                {(oldMessages.length === 0) ? (
                    <p className="text-gray-400 text-center mt-20">Chưa có tin nhắn</p>
                ) : (
                    <>
                        {oldMessages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex flex-col gap-1 mb-3 ${
                                    msg.senderId === userId ? 'items-end' : 'items-start'
                                }`}
                            >
                                <div className="flex items-end gap-2">
                                    {msg.senderId !== userId && (
                                        <img
                                            src={image}
                                            alt="Khách"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    )}
                                    <div
                                        className={`px-4 py-2 rounded-lg text-base max-w-xs ${
                                            msg.senderId === userId
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-800'
                                        }`}
                                    >
                                        {msg.content || msg.lastMessage}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>
        </div>
    );
};

export default HistoryChatMessage;
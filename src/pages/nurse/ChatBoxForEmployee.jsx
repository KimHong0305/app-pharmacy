import React, { useEffect, useRef, useState } from 'react';
import { GoDotFill } from 'react-icons/go';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { createMessage, historyChatMessage } from '../../store/Reducers/chat/chatUserReducer';
import { useDispatch, useSelector } from 'react-redux';

const ChatBoxForEmployee = ({ roomId, receiver }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const { messages } = useWebSocket();
    const dispatch = useDispatch();
    const { oldMessages } = useSelector((state) => state.chat_user);

    const userId = localStorage.getItem('user_id');

    useEffect(() => {
        if (roomId) {
            console.log('chay 1 lan');
            dispatch(historyChatMessage(roomId));
        }
    }, [roomId, dispatch]);

    const normalizedOldMessages = oldMessages.map(msg => ({
        id: msg.messageId,
        sender: msg.senderId,
        senderName: msg.senderName,
        senderImage: msg.senderImage,
        content: msg.content,
    }));

    const filteredMessages = messages.filter(msg => msg.roomId === roomId);
    const combinedMessages = [...normalizedOldMessages, ...filteredMessages];

    // console.log(oldMessages);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !roomId) return;

        const mess = {
            roomId: roomId,
            sender: userId,
            receiver: receiver,
            content: input.trim(),
        };

        console.log(mess)

        try {
            await dispatch(createMessage(mess)).unwrap();
            setInput('');
        } catch (error) {
            console.error("Lỗi gửi tin nhắn:", error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="flex flex-col p-4 bg-white rounded-lg shadow h-full">
            <div className="flex items-center gap-3 mb-4 border-b pb-4">
                <img
                    src="http://localhost:3000/images/avata_1.png"
                    alt="Nhân viên"
                    className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                    <p className="text-lg font-semibold">Bạn đang hỗ trợ</p>
                    <p className="flex items-center text-sm text-gray-500">
                        <GoDotFill className="mr-1 text-green-500 text-lg" />
                        Online
                    </p>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto bg-gray-50 p-4 rounded-lg shadow-inner max-h-[400px]">
                {(combinedMessages.length === 0) ? (
                    <p className="text-gray-400 text-center mt-20">Chưa có tin nhắn</p>
                ) : (
                    <>
                        {combinedMessages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex flex-col gap-1 mb-3 ${
                                    msg.sender === userId ? 'items-end' : 'items-start'
                                }`}
                            >
                                <div className="flex items-end gap-2">
                                    {msg.sender !== userId && (
                                        <img
                                            src={msg.senderImage || "/images/default-avatar.png"}
                                            alt="Khách"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    )}
                                    <div
                                        className={`px-4 py-2 rounded-lg text-base max-w-xs ${
                                            msg.sender === userId
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

            {/* Input */}
            <div className="mt-4 flex gap-3">
                <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    className="flex-grow px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className={`px-6 py-3 rounded-lg font-semibold text-white ${
                        input.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'
                    }`}
                >
                    Gửi
                </button>
            </div>
        </div>
    );
};

export default ChatBoxForEmployee;
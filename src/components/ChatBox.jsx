import React, { useState, useRef, useEffect } from 'react';
import { HiDotsHorizontal } from "react-icons/hi";
import { useDispatch } from 'react-redux';
import { createMessage, createRoom } from "../store/Reducers/chat/chatUserReducer";
import { useWebSocket } from '../contexts/WebSocketContext';
import { useNavigate } from 'react-router-dom';

const ChatBox = ({ onClose }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [roomId, setRoomId] = useState(null);
    const [localMessages, setLocalMessages] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { messages } = useWebSocket();
    const { clearMessages } = useWebSocket();
    const messagesEndRef = useRef(null);
    const userId = localStorage.getItem('user_id');

    const defaultSystemMessage = {
        sender: "system",
        content: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
    };

    useEffect(() => {
        const savedRoomId = localStorage.getItem('chat_room_id');
        if (savedRoomId) {
            setRoomId(savedRoomId);
        }

        const savedLocalMessages = localStorage.getItem('chat_local_messages');
        if (savedLocalMessages) {
            setLocalMessages(JSON.parse(savedLocalMessages));
        }

        const savedSystemMsg = localStorage.getItem("system_message_shown");
        if (!savedSystemMsg) {
            const systemMsg = [defaultSystemMessage];
            localStorage.setItem("chat_local_messages", JSON.stringify(systemMsg));
            localStorage.setItem("system_message_shown", "true");
            setLocalMessages(systemMsg);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, localMessages]);

    const sendChatMessage = async () => {
        if (!message.trim()) return;

        const messageObj = {
            sender: userId,
            content: message,
        };

        if (!roomId) {
            try {
                const res = await dispatch(createRoom({ content: message })).unwrap();
                const newRoomId = res.result.roomId;
                setRoomId(newRoomId);
                localStorage.setItem('chat_room_id', newRoomId);

                const updated = [...localMessages, messageObj];
                setLocalMessages(updated);
                localStorage.setItem('chat_local_messages', JSON.stringify(updated));
            } catch (e) {
                console.error("Lỗi tạo phòng:", e);
            }
        } else {
            const mess = {
                roomId: roomId,
                sender: userId,
                receiver: messages[0]?.sender,
                content: message
            };
            await dispatch(createMessage(mess)).unwrap();
        }

        setMessage("");
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    };

    const allMessages = [...localMessages, ...messages];

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center bg-blue-600 text-white p-3 rounded-t-lg font-semibold relative">
                Hỗ trợ trực tuyến
                <div className="relative">
                    <HiDotsHorizontal
                        className="cursor-pointer"
                        onClick={() => setIsMenuOpen(prev => !prev)}
                    />
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-md w-48 z-10">
                            <ul className="py-1 text-sm font-normal text-gray-700">
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setRoomId(null);
                                        localStorage.removeItem("chat_room_id");
                                        localStorage.removeItem("chat_local_messages");
                                        localStorage.removeItem("system_message_shown");
                                        const defaultSystemMsg = {
                                            sender: "system",
                                            content: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
                                        };

                                        setLocalMessages([defaultSystemMsg]);
                                        localStorage.setItem("chat_local_messages", JSON.stringify([defaultSystemMsg]));
                                        localStorage.setItem("system_message_shown", "true");
                                        setIsMenuOpen(false);
                                        clearMessages();
                                    }}
                                >
                                    Cuộc trò chuyện mới
                                </li>
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        navigate(`/user/chat/history`);
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    Lịch sử trò chuyện
                                </li>
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        if (onClose) onClose();
                                    }}
                                >
                                    Đóng cửa sổ
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                {allMessages.map((msg, index) => {
                    const isCurrentUser = msg.sender === userId;
                    const isSystem = msg.sender === 'system';

                    return (
                        <div
                            key={index}
                            className={`flex ${isSystem ? 'justify-start' : isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`px-4 py-2 rounded-lg max-w-[80%] text-sm ${
                                    isSystem
                                        ? 'bg-gray-200 text-gray-800'
                                        : isCurrentUser
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800'
                                }`}
                            >
                                {msg.text || msg.content}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-gray-200 flex gap-2">
                <textarea
                    rows={1}
                    className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-blue-500 resize-none"
                    placeholder="Nhập tin nhắn..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    onClick={sendChatMessage}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                >
                    Gửi
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
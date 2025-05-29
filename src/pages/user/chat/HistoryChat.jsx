import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { historyChat } from '../../../store/Reducers/chat/chatUserReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const HistoryChat = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { chats} = useSelector((state) => state.chat_user);

    useEffect(() => {
        dispatch(historyChat());
    }, [dispatch]);

    const handleClick = (roomId) => {
        navigate(`/user/chat/history/${roomId}`);
    };

    return (
        <div>
            <Header />
            <div className="container px-4 md:px-8 lg:px-48 container mx-auto my-10 min-h-[400px]">
            <h1 className="text-2xl font-bold mb-6">Lịch sử trò chuyện</h1>
            {chats.length === 0 ? (
                <p className="text-gray-500">Không có cuộc trò chuyện nào.</p>
            ) : (
                <ul className="space-y-4">
                {chats.map((chat) => (
                    <li key={chat.roomId} className="flex items-start gap-4 bg-white p-4 rounded shadow hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => handleClick(chat.roomId)}>
                    <img
                        src={chat.receiverImage}
                        alt={chat.receiverName}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
                        <h3 className="text-md font-semibold">{chat.receiverName}</h3>
                        <span className="text-sm text-gray-500">

                        </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                    </div>
                    </li>
                ))}
                </ul>
            )}
            </div>
            <Footer/>
        </div>
    );
};

export default HistoryChat;

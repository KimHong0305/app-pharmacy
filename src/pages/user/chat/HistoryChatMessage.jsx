import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { historyChatMessage } from "../../../store/Reducers/chat/chatUserReducer";
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { IoReturnDownBackSharp } from "react-icons/io5";

const HistoryChatMessage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { oldMessages } = useSelector((state) => state.chat_user);

    const currentUserId = localStorage.getItem("user_id");

    const handleGoBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        dispatch(historyChatMessage(id));
    }, [id, dispatch]);

    return (
        <div>
            <Header />
            <div className="container px-4 md:px-8 lg:px-48 container mx-auto my-10 min-h-[400px]">
                <span onClick={handleGoBack} className="inline-block">
                    <IoReturnDownBackSharp className="inline-block"/>
                    <button className="inline-block ml-5">Quay lại</button>
                </span>
                <div className="space-y-4">
                    {oldMessages.map((msg) => {
                        const isMyMessage = msg.senderId === currentUserId;

                        return (
                            <div
                                key={msg.messageId}
                                className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`flex items-end gap-2 max-w-[70%] ${
                                        isMyMessage ? "flex-row-reverse" : ""
                                    }`}
                                >
                                    <img
                                        src={msg.senderImage}
                                        alt="avatar"
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div
                                        className={`p-3 rounded-xl shadow ${
                                            isMyMessage
                                                ? "bg-blue-100 text-right"
                                                : "bg-gray-100 text-left"
                                        }`}
                                    >
                                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                                            {msg.content}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {/* {new Date(msg.time).toLocaleString("vi-VN")} */}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default HistoryChatMessage;

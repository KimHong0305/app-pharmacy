import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { historyChat } from '../../../store/Reducers/chat/chatUserReducer';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import HistoryChatMessage from './HistoryChatMessage';

const HistoryChat = () => {
    const dispatch = useDispatch();
    const { chats } = useSelector((state) => state.chat_user);
    const [selectedRoom, setSelectedRoom] = useState(null);

    useEffect(() => {
        if (chats && chats.length > 0) {
            const first = chats[0];
            setSelectedRoom({
                roomId: first.roomId,
                receiver: first.receiverName,
                image: first.receiverImage
            });
        }
    }, [chats]);

    console.log(chats[0])

    useEffect(() => {
        dispatch(historyChat());
    }, [dispatch]);


    const handleChooseRoom = async (room) => {
        setSelectedRoom({ roomId: room.roomId, receiver: room.receiverName, image: room.receiverImage });
    };

    const formatLastTimeShort = (lastTime) => {
        if (!lastTime) return '';
        const now = new Date();
        const time = new Date(lastTime);
        const diffMs = now - time;

        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        if (diffMinutes < 60) {
            return `${diffMinutes}p`;
        }

        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours < 24) {
            return `${diffHours}h`;
        }

        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d`;
    };

    return (
        <div>
            <Header />
            <div className="flex px-4 md:px-8 lg:px-48 min-h-[500px] p-4 gap-6 bg-gray-100">
                <div className="w-1/3 bg-white rounded-lg shadow-lg overflow-y-auto max-h-[550px]">
                    <h2 className="text-xl font-semibold sticky top-0 bg-white z-10 p-4 ">Đoạn chat</h2>
                    {chats.length === 0 ? (
                        <p className="text-gray-500 px-5"></p>
                    ) : (
                        chats.map((room) => (
                            <div
                                key={room.roomId}
                                className={`cursor-pointer py-3 px-2 border-b rounded relative
                                    ${selectedRoom?.roomId === room.roomId ? 'bg-blue-100' : 'hover:bg-gray-100'}
                                `}
                                onClick={() => handleChooseRoom(room)}
                            >

                                <div className="flex justify-start items-center">
                                    <img
                                        src={room.receiverImage}
                                        alt={room.receiverName}
                                        className="w-12 h-12 rounded-full object-cover border-2 mr-2"
                                    />
                                    <div>
                                        <p className="font-medium">{room.receiverName || 'Khách không tên'}</p>
                                        <div className="flex items-center justify-between w-[310px]">
                                            <p className="text-sm text-gray-500 truncate w-[250px]">
                                                {room.lastMessage}
                                            </p>
                                            <p className="text-sm text-gray-400 mr-2">
                                                {formatLastTimeShort(room.lastTime)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Main Chat Box */}
                <div className="flex-1">
                    {selectedRoom ? (
                        <HistoryChatMessage roomId={selectedRoom.roomId} receiver={selectedRoom.receiver} image={selectedRoom.image}/>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                            Chọn một khách hàng để phản hồi
                        </div>
                    )}
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default HistoryChat;
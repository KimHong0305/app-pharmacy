import React, { useState, useEffect } from 'react';
import ChatBoxForEmployee from './ChatBoxForEmployee';
import { useDispatch, useSelector } from 'react-redux';
import {
    chooseRoomVacant,
    getRoomVacant,
    historyChatRoom,
} from '../../store/Reducers/chat/chatNurseReducer';
import { toast } from 'react-toastify';
import { useWebSocket } from '../../contexts/WebSocketContext';

const Chat = () => {
    const dispatch = useDispatch();
    const { rooms, roomsWait } = useSelector((state) => state.chat_nurse);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const { messages } = useWebSocket();

    const pendingMessages = messages.filter((msg) => {
        return !msg.receiverId && !msg.receiver;
    });

    const waitingRooms = Object.values(
        pendingMessages.reduce((acc, msg) => {
            if (!acc[msg.roomId]) {
                acc[msg.roomId] = {
                    roomId: msg.roomId,
                    senderId: msg.senderId,
                    senderImage: msg.senderImage,
                    senderName: msg.senderName,
                    lastMessage: msg.content || msg.lastMessage,
                    roomStatus: msg.roomStatus || false,
                };
            }
            return acc;
        }, {})
    );

    const combinedRooms = [
        ...waitingRooms,
        ...rooms.filter(
            (apiRoom) => !waitingRooms.some((socketRoom) => socketRoom.roomId === apiRoom.roomId)
        ),
        ...roomsWait.filter(
            (historyRoom) =>
                !waitingRooms.some((r) => r.roomId === historyRoom.roomId) &&
                !rooms.some((r) => r.roomId === historyRoom.roomId)
        ),
    ];

    useEffect(() => {
        dispatch(getRoomVacant());
        dispatch(historyChatRoom());
    }, [dispatch]);

    // console.log(combinedRooms)

    const handleChooseRoom = async (room) => {
        if (room.roomStatus === true) {
            try {
                await dispatch(chooseRoomVacant(room.roomId)).unwrap();
                setSelectedRoom({ roomId: room.roomId, receiver: room.senderId, image: room.senderImage });
                toast.success('Hãy nói chuyện nhẹ nhàng với khách hàng nhé!');
            } catch (err) {
                toast.error(err);
            }
        }
        else {
            setSelectedRoom({ roomId: room.roomId, receiver: room.senderId, image: room.senderImage });
        }
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
        <div className="flex min-h-[500px] p-4 gap-6 bg-gray-100">
            <div className="w-1/3 bg-white rounded-lg shadow-lg overflow-y-auto max-h-[550px]">
                <h2 className="text-xl font-semibold sticky top-0 bg-white z-10 p-4 ">Đoạn chat</h2>
                {combinedRooms.length === 0 ? (
                    <p className="text-gray-500 px-5"></p>
                ) : (
                    combinedRooms.map((room) => (
                        <div
                            key={room.roomId}
                            className={`cursor-pointer py-3 px-2 border-b rounded relative
                                ${selectedRoom?.roomId === room.roomId ? 'bg-blue-100' : 'hover:bg-gray-100'}
                            `}
                            onClick={() => handleChooseRoom(room)}
                        >

                            <div className="flex justify-start items-center">
                                <img
                                    src={room.senderImage}
                                    alt={room.senderName}
                                    className="w-16 h-16 rounded-full object-cover border-2 mr-2"
                                />
                                <div>
                                    <p className="font-medium">{room.senderName || 'Khách không tên'}</p>
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
                            {room.roomStatus === true && (
                                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    New
                                </span>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Main Chat Box */}
            <div className="flex-1">
                {selectedRoom ? (
                    <ChatBoxForEmployee roomId={selectedRoom.roomId} receiver={selectedRoom.receiver} image={selectedRoom.image}/>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                        Chọn một khách hàng để phản hồi
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
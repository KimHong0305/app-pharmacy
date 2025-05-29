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
        try {
            await dispatch(chooseRoomVacant(room.roomId)).unwrap();
            setSelectedRoom({ roomId: room.roomId, receiver: room.senderId });
            toast.success('Hãy nói chuyện nhẹ nhàng với khách hàng nhé!');
        } catch (err) {
            toast.error(err);
        }
    };

    return (
        <div className="flex min-h-[500px] p-4 gap-6 bg-gray-100">
            <div className="w-1/3 bg-white rounded-lg shadow-lg p-4 overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Đoạn chat</h2>
                {combinedRooms.length === 0 ? (
                    <p className="text-gray-500">Không có khách hàng nào</p>
                ) : (
                    combinedRooms.map((room) => (
                        <div
                            key={room.roomId}
                            className="cursor-pointer py-3 border-b rounded hover:bg-gray-100 relative"
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
                                    <p className="text-sm text-gray-500">{room.lastMessage}</p>
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
                    <ChatBoxForEmployee roomId={selectedRoom.roomId} receiver={selectedRoom.receiver} />
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
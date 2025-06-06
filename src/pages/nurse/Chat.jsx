import React, { useState, useEffect, useRef } from 'react';
import ChatBoxForEmployee from './ChatBoxForEmployee';
import { useDispatch, useSelector } from 'react-redux';
import {
    chooseRoomVacant,
    getRoomVacant,
    historyChatRoom,
} from '../../store/Reducers/chat/chatNurseReducer';
import { toast } from 'react-toastify';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { IoChatbubblesOutline } from "react-icons/io5";

const Chat = () => {
    const dispatch = useDispatch();
    const { rooms, roomsWait } = useSelector((state) => state.chat_nurse);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const { messages } = useWebSocket();
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef();
    const [combinedRooms, setCombinedRooms] = useState([]);

    useEffect(() => {
        dispatch(historyChatRoom());
    }, [dispatch]);

    useEffect(() => {
        if (roomsWait.length > 0 && combinedRooms.length === 0) {
            setCombinedRooms(roomsWait);
        }
    }, [roomsWait, combinedRooms]);

    useEffect(() => {
        const pendingMessages = messages.filter((msg) => {
            return !msg.receiverId && !msg.receiver;
        });
        setUnreadCount(pendingMessages.length);
    }, [messages, showDropdown]);

    useEffect(() => {
        const handledRoomIds = combinedRooms.map((room) => room.roomId);

        const pendingMessages = messages.filter((msg) => {
            return (
                !msg.receiverId &&
                !msg.receiver &&
                !handledRoomIds.includes(msg.roomId)
            );
        });
        setUnreadCount(pendingMessages.length);
    }, [messages, showDropdown, combinedRooms]);

    const handleToggleDropdown = () => {
        setShowDropdown((prev) => {
            const newState = !prev;

            if (!prev) {
                dispatch(getRoomVacant());
            }

            return newState;
        });
    };

    const handleChooseRoom = async (room) => {
        if (room.roomStatus === true) {
            try {
                const result = await dispatch(chooseRoomVacant(room.roomId)).unwrap();
                toast.success(result.message);

                setCombinedRooms(prev => {
                    const exists = prev.some(r => r.roomId === room.roomId);
                    return exists ? prev : [room, ...prev];
                });

                setShowDropdown(false);
            } catch (err) {
                toast.error(err);
                return;
            }
        } else {
            setCombinedRooms(prev => {
                const exists = prev.some(r => r.roomId === room.roomId);
                return exists ? prev : [room, ...prev];
            });
        }

        setSelectedRoom({
            roomId: room.roomId,
            receiver: room.senderId,
            image: room.senderImage,
        });
    };


    const handleChoose = async (room) => {
        setSelectedRoom({
            roomId: room.roomId,
            receiver: room.senderId,
            image: room.senderImage,
        });
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
            <div className="w-1/3 bg-white rounded-lg shadow-lg py-4 overflow-y-auto relative max-h-[550px]" ref={dropdownRef}>
                <div className='flex justify-between items-center mb-4'>
                    <h2 className="text-xl px-4 font-semibold">Đoạn chat</h2>
                    <div className="relative cursor-pointer mr-2" onClick={handleToggleDropdown}>
                        <IoChatbubblesOutline className='size-6' />
                        {unreadCount > 0 && (
                            <span 
                                className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center"
                            >
                                {unreadCount}
                            </span>
                        )}
                    </div>
                </div>

                {showDropdown && (
                    <div className="absolute right-0 top-12 w-72 max-h-96 overflow-auto bg-white border rounded shadow-lg z-20">
                        {rooms.length === 0 ? (
                            <p className="p-4 text-gray-500">Không có khách hàng chờ</p>
                        ) : (
                            rooms.map((room) => (
                                <div
                                    key={room.roomId}
                                    className="cursor-pointer py-3 px-4 border-b hover:bg-gray-100 flex items-center"
                                    onClick={() => handleChooseRoom(room)}
                                >
                                    <img
                                        src={room.senderImage}
                                        alt={room.senderName}
                                        className="w-10 h-10 rounded-full object-cover border-2 mr-3"
                                    />
                                    <div>
                                        <p className="text-base font-medium">{room.senderName || 'Khách không tên'}</p>
                                        <div className="flex items-center justify-between w-[200px]">
                                            <p className="text-sm text-gray-500 truncate w-[100px]">
                                                {room.lastMessage}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {formatLastTimeShort(room.lastTime)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
                
                {combinedRooms.length === 0 ? (
                    <p className="text-gray-500 px-5"></p>
                ) : (
                    combinedRooms.map((room) => (
                        <div
                            key={room.roomId}
                            className={`cursor-pointer py-3 px-2 border-b rounded relative
                                ${selectedRoom?.roomId === room.roomId ? 'bg-blue-100' : 'hover:bg-gray-100'}
                            `}
                            onClick={() => handleChoose(room)}
                        >

                            <div className="flex justify-start items-center">
                                <img
                                    src={room.senderImage}
                                    alt={room.senderName}
                                    className="w-16 h-16 rounded-full object-cover border-2"
                                />
                                <div className='ml-2'>
                                    <p className="font-medium">{room.senderName || 'Khách không tên'}</p>
                                    <div className="flex items-center justify-between w-[300px]">
                                        <p className="text-sm text-gray-500 truncate w-[250px]">
                                            {room.lastMessage}
                                        </p>
                                        <p className="text-sm text-gray-400">
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
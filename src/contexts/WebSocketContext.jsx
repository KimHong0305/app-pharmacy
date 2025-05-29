import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

export const WebSocketContext = createContext(null);
export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedRole = localStorage.getItem('role');

        if (storedUsername && storedRole) {
            setUsername(storedUsername);
            setRole(storedRole);
        }
    }, []);

    console.log('tin nhan',messages)

    useEffect(() => {
        if (!username || !role) return;

        const WS_URL = `${process.env.REACT_APP_WS_BASE_URL}/ws-chats?username=${username}&role=${role}`;
        const ws = new WebSocket(WS_URL);
        socketRef.current = ws;

        console.log("🟡 Đang kết nối tới:", WS_URL);

        ws.onopen = () => console.log("✅ WebSocket connected chat");

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('📨 Received chat:', data);
            setMessages((prev) => [...prev, data]);
        };

        ws.onerror = (error) => console.error("❌ WebSocket error:", error);

    }, [username, role]);

    const clearMessages = () => setMessages([]);

    const sendMessage = (message) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(message);
        }
    };

    return (
        <WebSocketContext.Provider value={{ socketRef, sendMessage, messages, clearMessages }}>
            {children}
        </WebSocketContext.Provider>
    );
};
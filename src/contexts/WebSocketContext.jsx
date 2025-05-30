import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

export const WebSocketContext = createContext({
  socketRef: null,
  sendMessage: () => {},
  messages: [],
  clearMessages: () => {},
  setUserInfo: () => {},
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState(null);
    const [role, setRole] = useState(null);

    const setUserInfo = (username, role) => {
        setUsername(username);
        setRole(role);
        localStorage.setItem('username', username);
        localStorage.setItem('role', role);
    };

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const storedRole = localStorage.getItem('role');

        if (storedUsername && storedRole) {
            setUsername(storedUsername);
            setRole(storedRole);
        }
    }, []);

    useEffect(() => {
        if (!username || !role) return;

        const WS_URL = `${process.env.REACT_APP_WS_BASE_URL}/ws-chats?username=${username}&role=${role}`;
        const ws = new WebSocket(WS_URL);
        socketRef.current = ws;

        console.log("🟡 Đang kết nối tới:", WS_URL);

        ws.onopen = () => console.log("✅ WebSocket connected chat");

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('📨 Received chat:', data);
                setMessages((prev) => [...prev, data]);
            } catch (err) {
                console.error('❗ Lỗi phân tích tin nhắn:', err);
            }
        };

        ws.onerror = (error) => {
            console.error("❌ WebSocket error:", error);
        };

        ws.onclose = (event) => {
            console.log("🔌 WebSocket closed:", event.code, event.reason);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
                console.log("🛑 WebSocket disconnected");
            }
        };
    }, [username, role]);

    const clearMessages = () => setMessages([]);

    return (
        <WebSocketContext.Provider value={{ socketRef, messages, clearMessages, setUserInfo }}>
        {children}
        </WebSocketContext.Provider>
    );
};

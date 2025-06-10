import React, {
    createContext,
    useContext,
    useRef,
    useState,
    useCallback,
    useEffect,
    useMemo,
} from 'react';

export const WebSocketContext = createContext({});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const [messages, setMessages] = useState([]);

    const connectWebSocket = useCallback((username, role) => {
        if (
            socketRef.current &&
            [WebSocket.OPEN, WebSocket.CONNECTING].includes(socketRef.current.readyState)
        ) {
            console.log('⚠️ WebSocket đã được kết nối hoặc đang kết nối');
            return;
        }

        const WS_URL = `${process.env.REACT_APP_WS_BASE_URL}/ws-chats?username=${username}&role=${role}`;
        const ws = new WebSocket(WS_URL);
        socketRef.current = ws;

        console.log('🌐 Đang kết nối WebSocket tới:', WS_URL);

        ws.onopen = () => console.log('✅ WebSocket connected');

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('📨 Received chat:', data);
                setMessages((prev) => [...prev, data]);
            } catch (err) {
                console.error('❗ Lỗi phân tích tin nhắn:', err);
            }
        };

        ws.onerror = (error) => console.error('❌ WebSocket error:', error);
        ws.onclose = (event) => console.log('🔌 WebSocket closed:', event.code, event.reason);
    }, []);

    const sendMessage = (msg) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(msg));
        } else {
            console.warn('⚠️ WebSocket chưa sẵn sàng để gửi');
        }
    };

    const clearMessages = () => setMessages([]);
    const disconnect = () => {
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
            console.log('🛑 WebSocket disconnected');
        }
    };

    useEffect(() => () => disconnect(), []);

    const contextValue = useMemo(
        () => ({
            socketRef,
            connectWebSocket,
            sendMessage,
            messages,
            clearMessages,
            disconnect,
        }),
        [connectWebSocket, messages]
    );

    return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>;
};

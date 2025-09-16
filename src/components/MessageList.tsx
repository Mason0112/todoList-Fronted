// src/components/MessageList.tsx
import { type Message } from "../types/Message";
import { useEffect, useRef } from "react";

// --- 單一訊息氣泡 ---
interface MessageBubbleProps {
    message: Message;
    isOwnMessage: boolean;
}

function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
    const bubbleStyle: React.CSSProperties = {
        textAlign: isOwnMessage ? 'right' : 'left',
        margin: '10px',
        padding: '10px',
        backgroundColor: isOwnMessage ? '#dcf8c6' : '#fff',
        borderRadius: '10px',
        alignSelf: isOwnMessage ? 'flex-end' : 'flex-start'
    };
    
    return (
        <div style={bubbleStyle}>
            <strong>{message.sender}</strong>
            <p>{message.content}</p>
        </div>
    );
}


// --- 訊息列表 ---
interface MessageListProps {
    messages: Message[];
    currentUser: string;
}

export function MessageList({ messages, currentUser }: MessageListProps) {
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    // 讓列表自動滾動到底部
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', padding: '10px' }}>
            {messages.map(msg => (
                <MessageBubble 
                    key={msg.id} 
                    message={msg}
                    isOwnMessage={msg.sender === currentUser}
                />
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}
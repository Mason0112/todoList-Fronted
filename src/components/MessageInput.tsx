// src/components/MessageInput.tsx
import { useState } from "react";

interface MessageInputProps {
    onSendMessage: (content: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue('');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', padding: '10px' }}>
            <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{ flex: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                placeholder="輸入訊息..."
            />
            <button type="submit" style={{ marginLeft: '10px', padding: '10px 20px' }}>
                送出
            </button>
        </form>
    );
}
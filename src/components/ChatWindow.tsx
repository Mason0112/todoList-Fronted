import { type Message } from "..//types/Message";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

interface ChatWindowProps {
    messages: Message[];
    currentUser: string;
    onSendMessage: (content: string) => void;
}

export function ChatWindow({ messages, currentUser, onSendMessage }: ChatWindowProps) {
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', border: '1px solid #ccc' }}>
            <MessageList messages={messages} currentUser={currentUser} />
            <MessageInput onSendMessage={onSendMessage} />
        </div>
    );
}
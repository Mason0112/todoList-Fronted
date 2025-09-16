import { useState, useEffect, useRef } from "react";
import { type Message } from "../types/Message";
import { ChatWindow } from "../components/ChatWindow";
import apiClient from "../apiClient"; 
import { type LoginResponse } from "../types/User";
import { Client, type StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function ChatRoomPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null); 
  const stompClientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error("未找到 authToken，無法連線");
        return;
    }

    // 初始延遲，避免在快速重新整理時出現連線問題
    const timer = setTimeout(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            connectHeaders: { 'Authorization': 'Bearer ' + token },
            debug: (str) => console.log(new Date(), str),
        });

        client.onConnect = (frame) => {
            console.log("WebSocket 連線成功: " + frame);
            
            apiClient.get<LoginResponse>("/auth/me").then(response => {
                const userName = response.data.user.userName;
                setCurrentUser(userName);
                console.log(`使用者資訊獲取成功: ${userName}`);
            }).catch(error => {
                console.error("獲取使用者資訊失敗:", error);
            });

            subscriptionRef.current = client.subscribe("/topic/public", (message) => {
                const newMessage: Message = JSON.parse(message.body);
                setMessages(prev => prev.some(msg => msg.id === newMessage.id) ? prev : [...prev, newMessage]);
            });
        };

        client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        client.onDisconnect = () => {
            console.log("WebSocket 已斷開連線");
        };

        client.activate();
        stompClientRef.current = client;
    }, 500); // 延遲 500 毫秒

    return () => {
        clearTimeout(timer);
        console.log("useEffect cleanup: Deactivating STOMP client.");
        subscriptionRef.current?.unsubscribe();
        if (stompClientRef.current?.active) {
            stompClientRef.current.deactivate();
        }
    };
  }, []);

  const handleSendMessage = (content: string) => {
    const client = stompClientRef.current;
    if (client && client.active && currentUser) {
        const chatMessage = {
            sender: currentUser,
            content: content,
            type: 'CHAT'
        };
        client.publish({
            destination: "/app/chat.sendMessage",
            body: JSON.stringify(chatMessage)
        });
    } else {
        console.error("無法發送訊息：STOMP client 未連線或使用者不存在。");
    }
  };

  if (!currentUser) {
    return <div>正在載入使用者資訊...</div>;
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ChatWindow
        messages={messages}
        currentUser={currentUser}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

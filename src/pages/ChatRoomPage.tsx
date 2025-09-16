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
    const initializeChat = async () => {
      try {
        console.log("正在獲取使用者資訊...");
        const response = await apiClient.get<LoginResponse>("/auth/me");
        const userName = response.data.user.userName;
        setCurrentUser(userName);
        console.log(`使用者資訊獲取成功: ${userName}`);

        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("未找到 authToken，無法連線");
            return;
        }

        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            connectHeaders: {
                'Authorization': 'Bearer ' + token
            },
            debug: (str) => {
                console.log(new Date(), str);
            },
        });

        client.onConnect = (frame) => {
            console.log("WebSocket 連線成功: " + frame);
            if (!subscriptionRef.current) {
                subscriptionRef.current = client.subscribe("/topic/public", (message) => {
                    console.log(message.body)
                    const newMessage: Message = JSON.parse(message.body);
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                });
            }
        };

        client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        client.onDisconnect = () => {
            console.log("WebSocket 已斷開連線");
        }

        client.activate();
        stompClientRef.current = client;

      } catch (error) {
        console.error("初始化聊天室失敗:", error);
      }
    };

    if (!stompClientRef.current) {
      initializeChat();
    }

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      const client = stompClientRef.current;
      if (client && client.active) {
        console.log("正在斷開 WebSocket 連線...");
        client.deactivate();
        stompClientRef.current = null;
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

import { useState, useEffect, useRef } from "react";
import { type Message } from "../types/Message";
import { ChatWindow } from "../components/ChatWindow";
import apiClient from "../apiClient"; 
import { type LoginResponse } from "../types/User";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function ChatRoomPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null); 
  // 使用 useRef 來存放 stompClient 實例，避免 useEffect 清理函式的閉包問題
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    // 定義一個包含所有非同步邏輯的主函式
    const initializeChat = async () => {
      try {
        // --- 步驟一：先獲取登入者資料 ---
        console.log("正在獲取使用者資訊...");
        const response = await apiClient.get<LoginResponse>("/auth/me");
        const userName = response.data.user.userName;
        setCurrentUser(userName);
        console.log(`使用者資訊獲取成功: ${userName}`);

        // --- 步驟二：建立 STOMP Client ---
        console.log("正在設定 WebSocket 連線...");
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("未找到 authToken，無法連線");
            return;
        }

        // 這是新版 @stomp/stompjs 的標準做法
        const client = new Client({
            // 使用 webSocketFactory 來整合 SockJS
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            
            // 將認證 token 放在 connectHeaders 中
            connectHeaders: {
                'Authorization': 'Bearer ' + token
            },

            // 開啟 debug 可以在 console 看到詳細日誌
            debug: (str) => {
                console.log(new Date(), str);
            },
        });

        // --- 步驟三：設定連線成功後的回呼函式 ---
        client.onConnect = (frame) => {
            console.log("WebSocket 連線成功: " + frame);

            // 訂閱公開頻道
            client.subscribe("/topic/public", (message) => {
                console.log(message.body)
                const newMessage: Message = JSON.parse(message.body);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });
        };

        // --- 步驟四：設定錯誤處理 ---
        client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
        };

        client.onDisconnect = () => {
            console.log("WebSocket 已斷開連線");
        }

        // --- 步驟五：啟動連線 ---
        client.activate();

        // 將 client 實例存到 ref 中
        stompClientRef.current = client;

      } catch (error) {
        console.error("初始化聊天室失敗:", error);
      }
    };

    // 在 Strict Mode 中，useEffect 會執行兩次，所以要確保連線只建立一次
    if (!stompClientRef.current) {
      initializeChat();
    }

    // --- 步驟六：回傳清理函式 ---
    // 這個函式會在元件卸載時執行
    return () => {
      const client = stompClientRef.current;
      if (client && client.active) {
        console.log("正在斷開 WebSocket 連線...");
        client.deactivate();
        stompClientRef.current = null; // 清理 ref
      }
    };
  }, []); // 空依賴陣列，確保這個 effect 只在元件掛載時執行一次

  // 處理發送訊息的邏輯
  const handleSendMessage = (content: string) => {
    const client = stompClientRef.current;
    // 確保 client 存在、已連線，並且有使用者名稱
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

type MessageType = "CHAT" | "JOIN" | "LEAVE";

export interface Message {
  id: string;
  messageType: MessageType;
  sender: string;
  content: string;
}

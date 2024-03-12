export interface Message {
  content: string;
  timestamp: Date;
  sender_id: string;
  sender_name: string;
  receiver_id: string;
  receiver_name: string;
}

export interface ChatPaylod {
  room_id: string;
  message: Message;
}

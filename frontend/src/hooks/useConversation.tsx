import { create } from "zustand";

export type ConversationType = {
  id: string;
  fullName: string;
  profilePic: string;
};

export type MessageType = {
  id: string;
  body: string;
  senderId: string;
  createdAt: string;
};

interface ConversationState {
  selectedConversation: ConversationType | null;
  messages: MessageType[];
  setSelectedConversation: (conversation: ConversationType | null) => void;
  setMessages: (messages: MessageType[]) => void;
}

const useConversation = create<ConversationState>((set) => ({
  selectedConversation: null,
  messages: [],
  setSelectedConversation: (conversation) =>
    set({ selectedConversation: conversation }),
  setMessages: (messages) => set({ messages: messages }),
}));

export default useConversation;

import { create } from "zustand";
import { MessageType } from "../types/type";

export type ConversationType = {
  id: string;
  fullName?: string;
  profilePic?: string;
  name?: string;
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

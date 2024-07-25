import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MessageType, User, UserMessageType } from "../types/type";
import { useEffect } from "react";
import { useSocketContext } from "../@/components/providers/SocketProvider";

export const useCreateMessage = () => {
  const { id } = useParams();
  const { data: authUser } = useQuery<User>({ queryKey: ["authUser"] });
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  // updating ui function
  const handleUiUpdate = (data: MessageType) => {
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
    queryClient.setQueryData(
      ["getMessage", id],
      (oldConversations: UserMessageType[] | undefined) => {
        if (!oldConversations) return [];
        const messageDate = new Date(data.createdAt).toDateString();

        const updatedConversations = oldConversations.map((conversation) => {
          if (conversation.date === messageDate) {
            return {
              ...conversation,
              messages: [...conversation.messages, data],
            };
          }
          return conversation;
        });

        if (!updatedConversations.some((conv) => conv.date === messageDate)) {
          updatedConversations.push({
            date: messageDate,
            messages: [data],
          });
        }

        return updatedConversations;
      }
    );
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async (message: string) => {
      const res = await axios.post(`/api/messages/send/${id}`, { message });
      if (!res.data) throw new Error("Error in sending message");
      return res.data;
    },
  });

  const handleNewMessage = (newMessage: MessageType) => {
    if (newMessage.senderId === authUser?.id || newMessage.senderId === id) {
      handleUiUpdate(newMessage);
    }
  };
  useEffect(() => {
    if (id && socket) {
      socket.on("new-message", handleNewMessage);

      return () => {
        socket.off("new-message", handleNewMessage);
      };
    }
  }, [id, queryClient, mutate, socket]);

  return {
    mutate,
    isPending,
  };
};

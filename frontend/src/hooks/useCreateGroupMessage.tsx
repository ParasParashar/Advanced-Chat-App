import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { GroupMessageT, GroupMessageType } from "../types/type";
import { useEffect } from "react";
import { useSocketContext } from "../@/components/providers/SocketProvider";

export const useCreateGroupMessage = () => {
  const { id: groupId } = useParams();
  //   const { data: authUser } = useQuery<User>({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  // updating ui function
  const handleUiUpdate = (data: GroupMessageT) => {
    console.log(data, "og gthe receiver");

    queryClient.invalidateQueries({ queryKey: ["conversations"] });
    queryClient.setQueryData(
      ["getGroupMessage", groupId],
      (oldConversations: GroupMessageType[] | undefined) => {
        if (!oldConversations) return [];
        const messageDate = new Date(data.createdAt).toDateString();

        const updatedConversations = oldConversations.map((conversation) => {
          console.log(conversation.date, "latedr ddat");
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
      const res = await axios.post(`/api/group/message/send/${groupId}`, {
        message,
      });
      if (!res.data) throw new Error("Error in sending message");
      return res.data;
    },
    onSuccess: handleUiUpdate,
  });

  return {
    mutate,
    isPending,
  };
};

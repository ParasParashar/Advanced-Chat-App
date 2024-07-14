import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { MessageType } from "./useConversation";
import { useParams } from "react-router-dom";

export const useCreateMessage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (message: string) => {
      const res = await axios.post(`/api/messages/send/${id}`, { message });
      if (!res.data) throw new Error("Error in sending message");
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData<MessageType[]>(
        ["getMessage", id],
        (oldMessages) => {
          return oldMessages ? [...oldMessages, data] : [data];
        }
      );
    },
  });

  return {
    mutate,
    isPending,
  };
};

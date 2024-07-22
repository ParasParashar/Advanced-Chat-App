import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { MessageType } from "../types/type";

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
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["conversations"] }),
        queryClient.setQueryData<MessageType[]>(
          ["getMessage", id],
          (oldMessages) => {
            return oldMessages ? [...oldMessages, data] : [data];
          }
        ),
      ]);
    },
  });

  return {
    mutate,
    isPending,
  };
};

import LoadingSpinner from "../Loaders/LoadingSpinner";
import MessageCard from "./MessageCard";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useConversation, { MessageType } from "../../../hooks/useConversation";
import { useEffect, useRef } from "react";
import { FaComments } from "react-icons/fa";

const MessagesContainer = () => {
  const { selectedConversation } = useConversation();
  const { id } = useParams();
  const messageRef = useRef<HTMLDivElement>(null);
  const { data, isPending, error } = useQuery({
    queryKey: ["getMessage", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/messages/${id}`);
        if (!res.data) throw new Error("Error in getting" || error?.message);
        if (res.data) {
          return res.data;
        }
        return [];
      } catch (err: any) {
        throw new Error(err.message);
      }
    },
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (data) {
      const chatArea = messageRef.current;
      chatArea?.scrollTo({ top: chatArea.scrollHeight, behavior: "smooth" });
    }
  }, [data]);

  return (
    <div
      ref={messageRef}
      className="h-full flex flex-col gap-2 overflow-y-auto p-3 main-scrollbar"
    >
      {data?.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 mx-auto my-auto text-center    bg-indigo-100 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 rounded-lg shadow-md">
          <FaComments className="text-blue-500 text-6xl mb-4" />
          <h3 className="text-3xl font-serif text-gray-500">
            Currently you don &apos;t have any previous conversations with{" "}
            {selectedConversation?.fullName}.
          </h3>
        </div>
      )}
      {!isPending &&
        data.map((message: MessageType) => (
          <MessageCard key={message.id} message={message} />
        ))}
      {isPending && <LoadingSpinner size="sm" />}
    </div>
  );
};

export default MessagesContainer;

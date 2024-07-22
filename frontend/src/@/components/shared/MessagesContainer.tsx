import LoadingSpinner from "../Loaders/LoadingSpinner";
import MessageCard from "./MessageCard";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useConversation from "../../../hooks/useConversation";
import { useEffect, useRef } from "react";
import { FaComments } from "react-icons/fa";
import { useSocketContext } from "../providers/SocketProvider";
import { MessageType, User } from "../../../types/type";

const MessagesContainer = () => {
  const { data: authUser } = useQuery<User>({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  const { selectedConversation } = useConversation();
  const { id } = useParams();
  const messageRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<Map<string, HTMLDivElement>>(new Map());

  // getting the messages
  const { data, isPending, error } = useQuery({
    queryKey: ["getMessage", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/messages/${id}`);
        if (!res.data) throw new Error("Error in getting" || error?.message);
        return res.data;
      } catch (err: any) {
        throw new Error(err.message);
      }
    },
    refetchInterval: 5000,
  });

  //update message fumnction
  const updateMessage = (updatedMessage: MessageType) => {
    queryClient.setQueryData(
      ["getMessage", id],
      (oldData: MessageType[] | undefined) => {
        if (oldData) {
          const updatedMessages = oldData.map((msg) => {
            if (msg.id === updatedMessage.id) {
              return updatedMessage;
            } else {
              return msg;
            }
          });
          return updatedMessages;
        }
        return [updateMessage];
      }
    );
    queryClient.invalidateQueries({ queryKey: ["conversations"] });
  };
  // updating the seen status
  const { mutate } = useMutation({
    mutationFn: async ({ messageId }: { messageId: string }) => {
      const res = await axios.patch(`/api/messages/update/${id}`, {
        messageId,
      });
      if (res.data.error) throw new Error(res.data.error);
      return res.data;
    },
    onSuccess: (data) => {
      updateMessage(data);
    },
  });

  const handleNewMessage = (newMessage: MessageType) => {
    if (newMessage.senderId === authUser?.id || newMessage.senderId === id) {
      queryClient.setQueryData(
        ["getMessage", id],
        (oldData: MessageType[] | undefined) => {
          return oldData ? [...oldData, newMessage] : [newMessage];
        }
      );
    }
  };

  // for update message according to socket
  useEffect(() => {
    if (id && socket) {
      socket.on("new-message", handleNewMessage);
      socket.on("updated-message", updateMessage);

      // Clean up the event listener on unmount
      return () => {
        socket.off("new-message", handleNewMessage);
        socket.off("updated-message", updateMessage);
      };
    }
  }, [id, queryClient, data, socket]);

  // for scrolling
  useEffect(() => {
    if (data) {
      const chatArea = messageRef.current;
      chatArea?.scrollTo({ top: chatArea.scrollHeight, behavior: "smooth" });
    }
  }, [data]);

  // intersection observer for last message
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          if (entry.isIntersecting) {
            const messageSeen = entry.target.getAttribute("data-message-seen");
            if (messageSeen === "true") return;
            const messageId = entry.target.getAttribute("data-message-id");
            const senderId = entry.target.getAttribute("data-sender-id");
            if (
              messageId &&
              senderId !== authUser?.id &&
              messageSeen === "false"
            ) {
              mutate({ messageId });
            }
          }
        });
      },
      { threshold: 0.4 }
    );

    if (data) {
      observerRef.current.forEach((ref) => {
        if (ref) {
          observer.observe(ref);
        }
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [authUser?.id, mutate, selectedConversation?.id, data, id]);

  return (
    <div
      ref={messageRef}
      className="h-full flex flex-col gap-2 overflow-y-auto p-3 main-scrollbar"
    >
      {data?.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 mx-auto my-auto text-center bg-indigo-100 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 rounded-lg shadow-md">
          <FaComments className="text-blue-500 text-6xl mb-4" />
          <h3 className="text-3xl font-serif text-gray-500">
            Currently you don&apos;t have any previous conversations with{" "}
            {selectedConversation?.fullName}.
          </h3>
        </div>
      )}
      {!isPending &&
        data.map((message: MessageType) => (
          <div
            key={message.id}
            ref={(el) => el && observerRef.current.set(message.id, el)}
            data-message-id={message.id}
            data-sender-id={message.senderId}
            data-message-seen={message.seen}
          >
            <MessageCard message={message} />
          </div>
        ))}
      {isPending && <LoadingSpinner size="sm" />}
    </div>
  );
};

export default MessagesContainer;

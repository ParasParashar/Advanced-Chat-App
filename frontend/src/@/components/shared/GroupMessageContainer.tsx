import { useQuery, useQueryClient } from "@tanstack/react-query";
import useConversation from "../../../hooks/useConversation";
import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { FaComments, FaSpinner } from "react-icons/fa";
import { GroupMessageT, GroupMessageType } from "../../../types/type";
import axios from "axios";
import { formatDayOnly } from "../../../utils/date";
import GroupMessageCard from "./GroupMessageCard";

const GroupMessageContainer = () => {
  const { data: authUser } = useQuery<User>({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();
  const { selectedConversation } = useConversation();
  const { id: groupId } = useParams();
  const messageRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<Map<string, HTMLDivElement>>(new Map());

  // getting the group  messages
  const { data, isPending, error } = useQuery({
    queryKey: ["getGroupMessage", groupId],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/group/message/${groupId}`);
        if (!res.data) throw new Error("Error in getting" || error?.message);
        return res.data;
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
        <div className="flex flex-col items-center justify-center p-8 mx-auto my-auto text-center bg-indigo-100 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 rounded-lg shadow-md">
          <FaComments className="text-blue-500 text-6xl mb-4" />
          <h3 className="text-3xl font-serif text-gray-500">
            Currently you don&apos;t have any previous conversations with
            {selectedConversation?.name} group
          </h3>
        </div>
      )}
      {!isPending &&
        data.map((userMessages: GroupMessageType) => (
          <div key={userMessages.date}>
            <div className="relative w-full z-10">
              <div className="absolute top-[50%] flex justify-center items-center z-0 w-full h-[2px] rounded-full bg-gray-500/50" />
              <div className=" flex justify-center z-[-10]">
                <p className=" text-gray-700 bg-gradient-to-tr z-20 from-sky-100 to-slate-100 via-indigo-300 inline-block px-2 py-1 rounded-lg shadow-lg">
                  {formatDayOnly(userMessages.date)}
                </p>
              </div>
            </div>
            {userMessages.messages.map((message: GroupMessageT) => (
              <div
                key={message.id}
                ref={(el) => el && observerRef.current.set(message.id, el)}
                data-message-id={message.id}
                data-sender-id={message.senderId}
                data-message-seen={message.seen}
                className="py-2"
              >
                <GroupMessageCard message={message} />
              </div>
            ))}
          </div>
        ))}

      {isPending && (
        <div className=" w-full flex  justify-center ">
          <FaSpinner className="animate-spin text-center " size="10" />
        </div>
      )}
    </div>
  );
};

export default GroupMessageContainer;

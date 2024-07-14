import { useQuery } from "@tanstack/react-query";
import { User } from "../../../types/type";
import useConversation, { MessageType } from "../../../hooks/useConversation";

type MessageProps = {
  message: MessageType;
};

const MessageCard = ({ message }: MessageProps) => {
  const { selectedConversation } = useConversation();
  const { data: authUser } = useQuery<User>({ queryKey: ["authUser"] });
  const fromMe = message?.senderId === authUser?.id;
  const img = fromMe ? authUser?.profilePic : selectedConversation?.profilePic;
  const chatClass = fromMe ? "justify-end" : "justify-start";
  const bubbleClass = fromMe
    ? "bg-blue-500 text-white rounded-br-none "
    : "bg-gray-200 text-black rounded-bl-none";

  return (
    <div className={`flex ${chatClass} mb-4`}>
      {!fromMe && (
        <div className=" w-6 h-6 sm:w-10 sm:h-10 rounded-full mr-2">
          <img alt="User Profile" src={img} className="rounded-full" />
        </div>
      )}
      <div className={`max-w-xs md:max-w-md p-3 rounded-3xl ${bubbleClass}`}>
        <p className="text-sm md:text-md mb-1 break-all break-words">
          {message.body}
        </p>
        <span className="opacity-50 text-xs flex gap-1 items-center">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      {fromMe && (
        <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full ml-2">
          <img alt="User Profile" src={img} className="rounded-full" />
        </div>
      )}
    </div>
  );
};

export default MessageCard;
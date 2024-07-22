import { useNavigate } from "react-router-dom";
import useSidebarHook from "../../../hooks/useSidebarHook";
import useConversation from "../../../hooks/useConversation";
import MenuPopover from "./MenuPopover";
import { useSocketContext } from "../providers/SocketProvider";
import { useEffect, useState } from "react";
import { IoCheckmarkDoneOutline, IoCheckmarkDoneSharp } from "react-icons/io5";
import { Button } from "../ui/button";

type props = {
  id: string;
  fullname: string;
  profilePic: string;
  lastMessage?: string;
  username?: string;
  conversationId?: string;
  isSeen?: boolean;
  unseenMessages?: number | null;
  type: "search" | "sidebar";
};

const SidebarItem = ({
  id,
  fullname,
  profilePic,
  lastMessage,
  conversationId,
  type,
  isSeen,
  username,
  unseenMessages,
}: props) => {
  const { onlineUsers, socket } = useSocketContext();
  const { onClose } = useSidebarHook();
  const { setSelectedConversation, selectedConversation } = useConversation();
  const navigate = useNavigate();

  const handleClick = () => {
    setSelectedConversation({ id, fullName: fullname, profilePic });
    navigate(`/messages/${id}`);
    onClose();
  };

  const isActive = id === selectedConversation?.id;
  const isOnline = onlineUsers.includes(id);

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket?.on("typing", ({ senderId }) => {
      if (id === senderId) {
        setIsTyping(true);
      }
    });

    socket?.on("stopTyping", ({ senderId }) => {
      if (id === senderId) {
        setIsTyping(false);
      }
    });

    return () => {
      socket?.off("typing");
      socket?.off("stopTyping");
    };
  }, [id, socket]);

  return (
    <section
      onClick={handleClick}
      className={`flex overflow-hidden cursor-pointer duration-200 px-4 py-2 justify-between items-center bg-gray-50 hover:bg-blue-100/60 transition-all ease-in-out w-full gap-2 sidebar-animation ${
        isActive ? "bg-sky-100   shadow-inner" : ""
      }`}
    >
      <div className="flex items-center justify-start w-full">
        <div className="relative object-cover rounded-full w-10 h-10 mr-4">
          <img
            src={profilePic}
            alt="User Image"
            className="w-full h-full object-contain"
          />
          {isOnline && (
            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-indigo-500"></span>
          )}
        </div>
        <div className="flex flex-col w-full line-clamp-1">
          <p className="text-md font-semibold text-gray-900">{fullname}</p>
          {type === "search" && username && (
            <p className="text-sm text-gray-500 line-clamp-1 truncate">
              @{username}
            </p>
          )}
          {type === "sidebar" && lastMessage && (
            <p className="text-sm line-clamp-1 truncate">
              {isTyping ? (
                <div
                  className={`flex items-center transition-all duration-1000 ease-in-out opacity-0 ${
                    isTyping ? "opacity-100 animate-pulse" : ""
                  }`}
                >
                  <span className="text-gray-500">Typing...</span>
                </div>
              ) : (
                <p className="flex items-center justify-start gap-x-1 text-gray-500 line-clamp-1 w-full truncate">
                  {isSeen ? (
                    <IoCheckmarkDoneSharp size={20} className="text-blue-500" />
                  ) : (
                    <IoCheckmarkDoneOutline size={20} />
                  )}
                  {lastMessage.slice(0, 20) + "..."}
                </p>
              )}
            </p>
          )}
        </div>
      </div>
      {type === "sidebar" && (
        <div className=" mr-auto  transition-all duration-300 ease-in-out ">
          {unseenMessages !== 0 ? (
            <Button
              size={"icon"}
              variant={"ghost"}
              className="text-white hover:bg-transpairent hover:text-muted bg-sky-500/80 p-1 w-7 h-7  rounded-full  text-lg"
            >
              {unseenMessages}
            </Button>
          ) : (
            <MenuPopover conversationId={conversationId} type="conversation" />
          )}
        </div>
      )}
    </section>
  );
};

export default SidebarItem;

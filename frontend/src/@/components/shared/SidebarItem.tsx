import { useNavigate } from "react-router-dom";
import useSidebarHook from "../../../hooks/useSidebarHook";
import useConversation from "../../../hooks/useConversation";
import { cn } from "../../lib/utils";
import MenuPopover from "./MenuPopover";
import { useSocketContext } from "../providers/SocketProvider";

type props = {
  id: string;
  fullname: string;
  profilePic: string;
  lastMessage?: string;
  username?: string;
  conversationId?: string;
  type: "search" | "sidebar";
};
const SidebarItem = ({
  id,
  fullname,
  profilePic,
  lastMessage,
  conversationId,
  type,
  username,
}: props) => {
  const { onlineUsers } = useSocketContext();
  const { onClose } = useSidebarHook();
  const { setSelectedConversation, selectedConversation } = useConversation();
  const navigate = useNavigate();

  const handleClick = () => {
    setSelectedConversation({
      id: id,
      fullName: fullname,
      profilePic: profilePic,
    });
    navigate(`/messages/${id}`);
    onClose();
  };

  const isActive = id === selectedConversation?.id;
  const isOnline = onlineUsers.includes(id);

  return (
    <section
      onClick={handleClick}
      className={cn(
        "flex overflow-hidden  sidebar-animation items-center cursor-pointer  duration-200 px-2 p-1  justify-between  transition-all ease-in-out w-full gap-2   bg-sky-50 hover:bg-sky-200/80",
        isActive && " bg-blue-200/50"
      )}
    >
      <div className="flex items-center justify-start w-full h-full gap-2   ">
        <div className="relative  object-fill ">
          <img
            src={profilePic}
            alt="User Image"
            className="  rounded-full object-contain  size-12"
          />
          {isOnline && (
            <span className="absolute rounded-full p-1 top-1   right-1 text-blue-500 bg-blue-500" />
          )}
        </div>
        <div className="flex flex-col w-full gap-0.5 ">
          <p className="text-lg font-semibold">{fullname}</p>
          {type === "search" && username && (
            <p className="text-muted-foreground text-sm line-clamp-1 truncate">
              @{username}
            </p>
          )}
          {type === "sidebar" && lastMessage && (
            <p className="text-sm text-muted-foreground line-clamp-1 truncate break-all">
              {lastMessage.slice(0, 20) + "..."}
            </p>
          )}
        </div>
      </div>
      {type === "sidebar" && (
        <MenuPopover conversationId={conversationId} type="conversation" />
      )}
    </section>
  );
};

export default SidebarItem;

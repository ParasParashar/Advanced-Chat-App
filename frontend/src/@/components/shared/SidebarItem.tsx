import { useNavigate } from "react-router-dom";
import useSidebarHook from "../../../hooks/useSidebarHook";
import useConversation from "../../../hooks/useConversation";
import { cn } from "../../lib/utils";

type props = {
  id: string;
  fullname: string;
  profilePic: string;
  lastMessage?: string;
  username?: string;
};
const SidebarItem = ({
  id,
  fullname,
  profilePic,
  lastMessage,
  username,
}: props) => {
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

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-center cursor-pointer  duration-200 px-2 p-1  justify-start  transition-all ease-in-out w-full gap-2   bg-sky-50 hover:bg-sky-200/80",
        isActive && " bg-blue-200/50"
      )}
    >
      <img src={profilePic} alt="User Image" className="relative  size-10" />
      <div className="flex flex-col w-full gap-0.5 ">
        <p className="text-lg font-semibold">{fullname}</p>
        {username && (
          <p className="text-muted-foreground text-sm line-clamp-1 truncate">
            @{username}
          </p>
        )}
        {lastMessage && (
          <p className="text-sm text-muted-foreground line-clamp-1 truncate break-all">
            {lastMessage.slice(0, 20) + "..."}
          </p>
        )}
      </div>
    </div>
  );
};

export default SidebarItem;

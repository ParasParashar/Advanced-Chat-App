import { Link } from "react-router-dom";
import useConversation from "../../../hooks/useConversation";
import MobileSidebar from "./MobileSidebar";
import MenuPopover from "./MenuPopover";
import { useSocketContext } from "../providers/SocketProvider";
type headerProps = {
  type: "message" | "home";
};

const Header = ({ type }: headerProps) => {
  const { selectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(selectedConversation?.id as string);

  return (
    <header className="p-2 w-full h-16  flex items-center   gap-2  bg-gradient-to-r from-sky-50 to-indigo-200 shadow-lg">
      <div className="block lg:hidden ">
        <MobileSidebar />
      </div>
      {type === "message" ? (
        <div className="flex items-center px-2 w-full justify-between   gap-2">
          <div className="flex items-center gap-x-2 ">
            <div className="relative  object-fill ">
              <img
                src={selectedConversation?.profilePic}
                alt="User Image"
                className="  rounded-full object-contain  size-12"
              />
              {isOnline && (
                <span className="absolute rounded-full p-1 top-1   right-1 text-blue-500 bg-blue-500" />
              )}
            </div>
            <span className="text-lg md:text-xl font-sans  font-semibold ">
              {selectedConversation?.fullName}
            </span>
          </div>
          <MenuPopover type="chat" />
        </div>
      ) : (
        <Link to={"/"}>
          <h5 className="text-xl text-center font-serif  font-bold">
            Chat-app
          </h5>
        </Link>
      )}
    </header>
  );
};

export default Header;

import { Link } from "react-router-dom";
import useConversation from "../../../hooks/useConversation";
import MobileSidebar from "./MobileSidebar";
import MenuPopover from "./MenuPopover";
type headerProps = {
  type: "message" | "home";
};

const Header = ({ type }: headerProps) => {
  const { selectedConversation } = useConversation();

  return (
    <header className="p-2 w-full h-16  flex items-center   gap-2  bg-gradient-to-r from-sky-50 to-indigo-200 shadow-lg">
      <div className="block lg:hidden ">
        <MobileSidebar />
      </div>
      {type === "message" ? (
        <div className="flex items-center px-2 w-full justify-between   gap-2">
          <div className="flex items-center ">
            <img
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
              src={selectedConversation?.profilePic}
              alt="Profile avatar"
            />
            <span className="text-lg md:text-xl font-sans">
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

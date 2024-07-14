import useConversation from "../../../hooks/useConversation";
import MobileSidebar from "./MobileSidebar";
type headerProps = {
  type: "message" | "home";
};

const Header = ({ type }: headerProps) => {
  const { selectedConversation } = useConversation();

  return (
    <header className="p-2 w-full h-16  flex items-center gap-2  bg-slate-200 shadow-lg">
      <div className="block lg:hidden ">
        <MobileSidebar />
      </div>
      {type === "message" && (
        <div className="flex items-center  gap-2">
          <img
            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
            src={selectedConversation?.profilePic}
            alt="Profile avatar"
          />
          <span className="text-lg md:text-xl font-sans">
            {selectedConversation?.fullName}
          </span>
        </div>
      )}
    </header>
  );
};

export default Header;

import useConversation from "../../../hooks/useConversation";
import MenuPopover from "./MenuPopover";
import MobileSidebar from "./MobileSidebar";
import UserAvatar from "./UserAvatart";

export default function GroupHeader() {
  const { selectedConversation } = useConversation();
  return (
    <header className="p-2 w-full h-16  flex items-center   gap-2  bg-gradient-to-r from-sky-50 to-indigo-200 shadow-lg">
      <div className="block lg:hidden ">
        <MobileSidebar />
      </div>
      <div className="flex items-center px-2 w-full justify-between   gap-2">
        <div className="flex items-center   gap-x-2 ">
          <UserAvatar type={"group"} name={selectedConversation?.name} />

          <div className="flex flex-col items-start justify-center ">
            <p className="text-lg md:text-xl font-sans  font-semibold ">
              {selectedConversation?.name}
            </p>
            {/* <div
                className={cn(
                  "flex items-center w-5 p-0 h-5 transition-all duration-1000 ease-in-out  opacity-0",
                  isTyping && "opacity-100 animate-pulse"
                )}
              >
                <span className="text-[10px] p-0 ">Typing...</span>
              </div> */}
          </div>
        </div>
        <MenuPopover type="chat" />
      </div>
    </header>
  );
}

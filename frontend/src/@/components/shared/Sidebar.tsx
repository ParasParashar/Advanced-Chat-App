import SidebarItem from "./SidebarItem";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { UserSkeleton } from "../Loaders/UserSkeleton";
import { SidebarData } from "../../../types/type";
import SearchModal from "./SearchModal";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useSocketContext } from "../providers/SocketProvider";
import SidebarFooter from "./SidebarFooter";
import { Button } from "../ui/button";

export default function Sidebar() {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      try {
        const { data } = await axios.get("/api/messages/conversations");
        if (data.error) {
          throw new Error(data.error);
        }
        return data;
      } catch (error: any) {
        throw new Error(error.message || "error in getting all the user");
      }
    },
  });

  useEffect(() => {
    socket?.on("new-message", () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });
    return () => {
      socket?.off("new-message");
    };
  }, [socket]);

  return (
    <aside className="bg-secondary w-full h-full  relative shadow-lg  overflow-hidden ">
      <div className=" flex items-center gap-x-3 justify-between  w-full p-2 py-4  bg-sky-200 ">
        <img
          src="/chatImage.png"
          alt="Logo"
          className="w-10 h-10 object-cover "
        />
        <Link to="/">
          <p className="text-2xl font-bold font-serif  text-center">CHAT APP</p>
        </Link>
      </div>
      <Button
        size={"icon2"}
        className="rounded-full  absolute bottom-[7rem] right-[2rem] "
      >
        <SearchModal />
      </Button>

      {/* conversations */}
      <div className="h-full flex-1  overflow-y-auto main-scrollbar">
        {isLoading &&
          Array.from({ length: 3 }, (_, index: number) => index).map(
            (_, i: number) => <UserSkeleton key={i} />
          )}
        {users?.length === 0 && !isLoading && (
          <p className="text-center text-sm text-muted-foreground py-10">
            Currently&apos;s you don&apos;t have any past conversations
          </p>
        )}
        {!isLoading &&
          users?.map((user: SidebarData) => (
            <SidebarItem
              key={user.id}
              conversationId={user.id}
              id={user.participants.id}
              fullname={user.participants.fullname}
              lastMessage={user.message.body}
              profilePic={user.participants.profilePic}
              isSeen={user.message.seen}
              unseenMessages={user.unseenMesssages}
              type="sidebar"
            />
          ))}
      </div>
      {/* footer */}
      <SidebarFooter />
    </aside>
  );
}

import { LuLogOut } from "react-icons/lu";
import SidebarItem from "./SidebarItem";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { UserSkeleton } from "../Loaders/UserSkeleton";
import { SidebarData } from "../../../types/type";
import SearchModal from "./SearchModal";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const { data } = await axios.post("/api/auth/logout");
        if (data.error) throw new Error(data.error);
        return data;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
    onSuccess: (data) => {
      toast.success(data.message || "Logged out successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Logout failed");
    },
  });

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
  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };
  return (
    <aside className="bg-secondary w-full h-full  relative shadow-lg">
      <div className=" flex items-center gap-x-3 justify-between  w-full p-2 py-4  bg-sky-200 ">
        <img
          src="/chatImage.png"
          alt="Logo"
          className="w-10 h-10 object-cover "
        />
        <Link to="/">
          <p className="text-2xl font-bold font-serif  text-center">CHAT APP</p>
        </Link>
        <SearchModal />
      </div>
      {/* <SearchUser /> */}
      <div className="flex flex-col gap-2  ">
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
              type="sidebar"
            />
          ))}
      </div>
      <Button
        onClick={handleLogout}
        size={"icon"}
        variant={"ghost"}
        className="  absolute  bottom-1 left-2 "
      >
        {isPending ? <FaSpinner size={10} /> : <LuLogOut size={20} />}
        {/* Logout */}
      </Button>
    </aside>
  );
}

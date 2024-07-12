import { LuLogOut } from "react-icons/lu";
import SidebarItem from "./SidebarItem";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { User } from "../../../types/type";
import { UserSkeleton } from "../Loaders/UserSkeleton";

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
    queryKey: ["users"],
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
  console.log(users);
  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  return (
    <aside className="bg-secondary w-full h-full  relative shadow-lg">
      <div className="text-2xl font-bold font-serif  text-center  w-full p-2 py-4  bg-sky-200 ">
        CHAT APP
      </div>
      <div className="flex flex-col gap-2 ">
        {isLoading &&
          Array.from({ length: 3 }, (_, index: number) => index).map(
            (_, i: number) => <UserSkeleton key={i} />
          )}
        {!users && !isLoading && (
          <p className="text-center text-sm text-muted-foreground py-10">
            Currently&apos;s you don&apos;t have any past conversations
          </p>
        )}
        {!isLoading &&
          users?.map((user: User) => (
            <SidebarItem
              key={user.id}
              id={user.id}
              fullname={user.fullname}
              profilePic={user.profilePic}
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

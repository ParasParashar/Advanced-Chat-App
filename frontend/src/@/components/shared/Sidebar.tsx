import { LuLogOut } from "react-icons/lu";
import SidebarItem from "./SidebarItem";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import toast from "react-hot-toast";
import { redirect, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const queryClient = useQueryClient();
  // const navigate = useNavigate();
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
  // const { mutate, isPending } = useMutation({
  //   mutationFn: async () => {
  //     try {
  //       const res = await fetch("/api/auth/logout", {
  //         method: "POST",
  //       });
  //       const data = await res.json();

  //       if (!res.ok) {
  //         throw new Error(data.error || "Something went wrong");
  //       }
  //     } catch (error: any) {
  //       throw new Error(error);
  //     }
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["authUser"] });
  //   },
  //   onError: () => {
  //     toast.error("Logout failed");
  //   },
  // });
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
        <SidebarItem id={"2"} />
        <SidebarItem id={"23"} />
        <SidebarItem id={"232"} />
        <SidebarItem id={"2323"} />
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

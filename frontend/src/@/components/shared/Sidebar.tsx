import { LuLogOut } from "react-icons/lu";
import SidebarItem from "./SidebarItem";
import { Button } from "../ui/button";

export default function Sidebar() {
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
        size={"icon"}
        variant={"ghost"}
        className="  absolute  bottom-1 left-2 "
      >
        <LuLogOut size={20} />
        {/* Logout */}
      </Button>
    </aside>
  );
}

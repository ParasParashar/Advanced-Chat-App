import { RxCross2 } from "react-icons/rx";
import { useGroupInfoHook } from "../../../hooks/useSidebarHook";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import UserAvatar from "./UserAvatart";
import { UserSkeleton } from "../Loaders/UserSkeleton";
import GroupInfoCard from "./GroupInfoCard";
import { BiTrash } from "react-icons/bi";
import { CiLogout } from "react-icons/ci";
import { IoIosPersonAdd } from "react-icons/io";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { formatGroupDate } from "../../../utils/date";
import { MemberType } from "../../../types/type";

const GroupInfoSidebar = () => {
  const { id: groupId } = useParams();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { isOpen, onClose } = useGroupInfoHook();
  const { data, isPending } = useQuery({
    queryKey: ["groupInfo"],
    queryFn: async () => {
      const res = await axios.get(`/api/group/info/${groupId}`);
      if (res.data.error)
        throw new Error(res.data.error || "Error in getting the group info");
      return res.data;
    },
  });
  const isuserAdmin = data?.members
    .filter((user: MemberType) => user.isAdmin)
    .map((user: MemberType) => user.user.id)
    .includes(authUser?.id);
  return (
    <aside
      className={cn(
        "hidden md:w-[450px]  h-full overflow-y-auto main-scrollbar bg-gradient-to-br to-sky-100 from-slate-100 via-indigo-300",
        isOpen && "md:block shadow-lg "
      )}
    >
      <section className="flex flex-col  w-full  h-full">
        <div className="flex p-1 border-b items-center justify-around">
          <Button
            className="rounded-full"
            onClick={() => onClose()}
            variant={"ghost"}
            size={"icon"}
          >
            <RxCross2 size={20} />
          </Button>
          <h6 className="text-md text-muted-foreground  font-bold">
            Group Information
          </h6>
        </div>
        <div className="flex  items-center justify-between  px-3 p-3 border-b">
          <UserAvatar type="group" name="All three group" />
          <div>
            <h6 className="text-lg text-slate-500 font-bold">{data?.name}</h6>
            <p className="text-xs font-semibold text-gray-700/90">
              Group Created on {formatGroupDate(data?.createdAt)}
            </p>
          </div>
        </div>
        <span className="text-sm text-gray-500  font-semibold p-2">
          Members {data?.members?.length}
        </span>
        <div className="flex flex-col px-1 flex-1 gap-1 overflow-x-hidden h-3/4 overflow-y-auto main-scrollbar">
          {isPending
            ? Array.from({ length: 3 }, (_, index) => index + 1).map((item) => (
                <UserSkeleton key={item} />
              ))
            : data.members?.map((item: MemberType) => {
                return (
                  <GroupInfoCard
                    key={item.id}
                    username={item?.user?.username as string}
                    fullname={item.user.fullname}
                    userId={item.user.id}
                    profilePic={item.user.profilePic}
                    isAdmin={item.isAdmin}
                    isUserAdmin={isuserAdmin}
                    groupMemberId={item.id}
                    groupId={groupId as string}
                    isMe={item.user.id === authUser?.id}
                  />
                );
              })}
        </div>
        <div className="flex flex-col gap-1 p-2  py-3 bg-indigo-300/50">
          <Button
            variant={"destructive"}
            className="  flex items-center justify-between hover:opacity-70"
          >
            <CiLogout size={20} />
            Leave Group
          </Button>
          {isuserAdmin && (
            <>
              <Button className=" bg-sky-300/50 hover:bg-sky-400 flex items-center justify-between hover:opacity-70">
                <IoIosPersonAdd size={20} />
                Add User
              </Button>
              <Button
                variant={"destructive"}
                className="flex items-center justify-between hover:opacity-70"
              >
                <BiTrash size={20} />
                Delete Group
              </Button>
            </>
          )}
        </div>
      </section>
    </aside>
  );
};

export default GroupInfoSidebar;

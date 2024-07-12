import { useNavigate } from "react-router-dom";
import useSidebarHook from "../../../hooks/useSidebarHook";

type props = {
  id: string;
  fullname: string;
  profilePic: string;
};
const SidebarItem = ({ id, fullname, profilePic }: props) => {
  const { onClose } = useSidebarHook();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/messages/${id}`);
    onClose();
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center cursor-pointer  duration-200 px-2 p-1  justify-start  transition-all ease-in-out w-full gap-2   bg-sky-50 hover:bg-sky-100"
    >
      <img src={profilePic} alt="User Image" className="relative  size-10" />
      <div className="flex flex-col gap-0.5 ">
        <p className="text-lg font-semibold">{fullname}</p>
        <span className="text-sm">this is the last message</span>
      </div>
    </div>
  );
};

export default SidebarItem;

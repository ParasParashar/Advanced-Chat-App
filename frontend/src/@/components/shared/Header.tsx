import { BiMenu } from "react-icons/bi";
import { Button } from "../ui/button";

import MobileSidebar from "./MobileSidebar";
type headerProps = {
  type: "message" | "home";
};

const Header = ({ type }: headerProps) => {
  return (
    <header className="p-2 w-full h-16  flex items-center gap-2  bg-slate-200 shadow-lg">
      <MobileSidebar>
        <Button
          size="icon"
          variant={"ghost"}
          className="rounded-full flex items-center justify-center md:hidden text-center"
        >
          <BiMenu size={25} />
        </Button>
      </MobileSidebar>
      {type === "message" && (
        <div className="flex items-center  gap-2">
          <img
            className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
            src="https://avatar.iran.liara.run/public/64"
            alt="Profile avatar"
          />
          <span className="text-lg md:text-xl font-sans">Paras Parashar</span>
        </div>
      )}
    </header>
  );
};

export default Header;

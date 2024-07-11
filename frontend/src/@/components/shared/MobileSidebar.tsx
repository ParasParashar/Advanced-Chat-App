import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Sidebar from "./Sidebar";

const MobileSidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side={"left"} className="p-0 w-full">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;

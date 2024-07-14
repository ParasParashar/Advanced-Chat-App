import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { PiNotePencilDuotone } from "react-icons/pi";
import SearchUser from "./SearchUser";

const SearchModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <PiNotePencilDuotone size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full h-3/4 overflow-y-auto main-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-muted-foreground">
            Start new chat
          </DialogTitle>
          <SearchUser />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;

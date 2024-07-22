import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { RiMessage3Fill } from "react-icons/ri";
import SearchUser from "./SearchUser";

const SearchModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={"icon2"}
          variant={"ghost"}
          className="bg-indigo-600 hover:bg-indigo-50 hover:text-sky-800 rounded-full text-white transition-all duration-300 ease-in-out"
        >
          <RiMessage3Fill size={26} />
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

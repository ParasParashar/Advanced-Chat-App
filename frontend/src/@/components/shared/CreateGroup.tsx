import { Button } from "../ui/button";
import { GrGroup } from "react-icons/gr";

import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import GroupCreation from "./GroupCreation";
import { DialogTitle } from "@radix-ui/react-dialog";

const CreateGroup = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          size={"icon"}
          variant={"ghost"}
          className="bg-indigo-600 hover:bg-indigo-50 hover:text-sky-800 rounded-full text-white transition-all duration-300 ease-in-out"
        >
          <GrGroup size={20} />
        </Button>{" "}
      </DialogTrigger>
      <DialogContent className=" w-full overflow-y-auto main-scrollbar p-0 bg-sky-100">
        <DialogTitle className="text-muted-foreground text-xl text-center p-2">
          Create Group
        </DialogTitle>
        <GroupCreation />
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroup;

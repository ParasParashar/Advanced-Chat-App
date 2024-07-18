import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CiMenuKebab } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import useConversation from "../../../hooks/useConversation";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import LoadingSpinner from "../Loaders/LoadingSpinner";

const MenuPopover = () => {
  const { selectedConversation } = useConversation();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const { data } = await axios.delete(
          `/api/messages/conversation/chat/${selectedConversation?.id}`
        );

        if (data.error) {
          throw new Error(data.error);
        }

        toast.success("Chat Cleared");
        return data;
      } catch (error: any) {
        throw new Error(
          error.response.data.error || "Failed to delete message"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getMessage", selectedConversation?.id],
      });
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate();
  };

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant={"ghost"} size={"icon"}>
          <CiMenuKebab size={20} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-3 w-auto">
        <Button
          disabled={isPending}
          onClick={handleSubmit}
          size={"lg"}
          variant={"destructive"}
          className="text-sm  group-hover:text-rose-800  group space-x-2"
        >
          {isPending ? (
            <LoadingSpinner size="sm" />
          ) : (
            <MdDelete className="group-hover:text-rose-800" size={20} />
          )}
          Clear Chat
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default MenuPopover;

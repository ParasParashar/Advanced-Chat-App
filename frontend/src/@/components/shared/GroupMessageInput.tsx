import { BiSend } from "react-icons/bi";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Emoji from "./Emoji";
import { useState } from "react";
import { useCreateGroupMessage } from "../../../hooks/useCreateGroupMessage";

const GroupMessageInput = () => {
  const [message, setMessage] = useState("");
  const { mutate, isPending } = useCreateGroupMessage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  const handleEmojiClick = (emojiObject: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setMessage((prevMessage: string) => prevMessage + emojiObject.emoji);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== "") {
      mutate(message);
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full  flex items-center justify-center 
      border-sky-50 px-3 p-2 pb-1 gap-1 rounded-full
      bg-gradient-to-l from-sky-50 to-indigo-200 
      "
    >
      <Emoji onEmojiClick={handleEmojiClick} />
      <Input
        placeholder="Type your message"
        onChange={handleChange}
        value={message}
        className="text-xl w-full ring-0 focus-visible:ring-0   outline-none p-3   rounded-sm border-none"
        autoFocus
        required
      />
      <Button
        size={"icon"}
        disabled={isPending}
        variant={"ghost"}
        className="group"
      >
        <BiSend size={30} className="text-blue-500 group-hover:text-blue-400" />
      </Button>
    </form>
  );
};

export default GroupMessageInput;

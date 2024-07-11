import { BiSend } from "react-icons/bi";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  return (
    <div className="w-full flex items-center justify-center  border-sky-50 px-3 p-2 pb-1 gap-1 bg-gray-200">
      <Input
        placeholder="Type your message"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMessage(e.target.value)
        }
        value={message}
        className="text-xl w-full ring-0 focus-visible:ring-0   outline-none p-3   rounded-sm border-none"
      />
      <Button variant={"ghost"}>
        <BiSend size={30} className="text-blue-500" />
      </Button>
    </div>
  );
};

export default MessageInput;

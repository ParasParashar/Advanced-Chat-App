import { BiSend } from "react-icons/bi";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import React, { useState } from "react";
import { useCreateMessage } from "../../../hooks/useCreateGetMessage";
import Emoji from "./Emoji";

const MessageInput = () => {
  const [message, setMessage] = useState("");

  const { mutate, isPending } = useCreateMessage();

  //       if (!res.data)
  //         throw new Error(res.data.error || "error in sending message");
  //       return res.data;
  //     } catch (error: any) {
  //       throw new Error(error.response.data.error);
  //     }
  //   },
  //   onSuccess: () => {
  //     setMessage("");
  //     queryClient.invalidateQueries({ queryKey: ["createMessage"] });
  //   },
  // });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== "") {
      mutate(message);
      setMessage("");
    }
  };
  const handleEmojiClick = (emojiObject: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full  flex items-center justify-center  border-sky-50 px-3 p-2 pb-1 gap-1 bg-gray-200 rounded-full"
    >
      <Emoji onEmojiClick={handleEmojiClick} />
      <Input
        placeholder="Type your message"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMessage(e.target.value)
        }
        value={message}
        className="text-xl w-full ring-0 focus-visible:ring-0   outline-none p-3   rounded-sm border-none"
      />
      <Button disabled={isPending} variant={"ghost"}>
        <BiSend size={30} className="text-blue-500" />
      </Button>
    </form>
  );
};

export default MessageInput;

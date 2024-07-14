import { FaComments } from "react-icons/fa";
import Header from "../shared/Header";
import MessageInput from "../shared/MessageInput";
import MessagesContainer from "../shared/MessagesContainer";
import useConversation from "../../../hooks/useConversation";

const MessagePage = () => {
  const { selectedConversation } = useConversation();
  return (
    <main
      className="w-full  h-full flex flex-col flex-1 overflow-hidden
    bg-gradient-to-tr from-sky-100 to-slate-100 via-indigo-300
    "
    >
      {!selectedConversation ? (
        <>
          <Header type="home" />
          <div className="flex flex-col items-center justify-center p-8 mx-auto my-auto text-center    bg-indigo-100 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-30 rounded-lg shadow-md">
            <FaComments className="text-blue-500 text-6xl mb-4" />
            <h3 className="text-3xl font-serif text-gray-500">
              Select a user to start message
            </h3>
          </div>
        </>
      ) : (
        <>
          <Header type="message" />
          <MessagesContainer />
          <MessageInput />
        </>
      )}
    </main>
  );
};

export default MessagePage;

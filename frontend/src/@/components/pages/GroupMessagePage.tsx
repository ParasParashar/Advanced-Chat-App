import { FaComments } from "react-icons/fa";
import useConversation from "../../../hooks/useConversation";
import Header from "../shared/Header";
import GroupHeader from "../shared/GroupHeader";
import GroupMessageInput from "../shared/GroupMessageInput";
import GroupMessageContainer from "../shared/GroupMessageContainer";

export default function GroupMessagePage() {
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
              Select a group to start conversation
            </h3>
          </div>
        </>
      ) : (
        <>
          <GroupHeader />
          <GroupMessageContainer />
          <GroupMessageInput />
        </>
      )}
    </main>
  );
}

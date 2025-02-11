import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import "../style.css"

import Bot_chatcontainer_ from "../ChatBot_component/Bot_chatcontainer_";
const HomePage = () => {
  const { selectedUser, getBot } = useChatStore();

  return (
    <div className="h-screen bg-base-20 ">
      <div className="flex justify-center pt-20 ">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-9xl h-[calc(108vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />

            {!selectedUser ? ( getBot?<Bot_chatcontainer_/>:<NoChatSelected /> ): <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
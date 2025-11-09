import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import "../style.css";
import { CheckCheck } from "lucide-react";

// --- Sub-Component for a Single Message ---
const Message = ({ message, isSender, selectedUser, authUser, lastMessageRef, isGrouped, isLastInGroup }) => {
  const profilePic = isSender
    ? authUser.profilePic || "/avatar.png"
    : selectedUser.profilePic || "/avatar.png";

  const bubbleClass = isSender 
    ? "bg-primary text-primary-content"
    : "bg-base-300 text-base-content";

  const showAvatar = !isSender && !isGrouped; 

  return (
    <div 
      ref={lastMessageRef} 
      // Main message row container. Max-width is applied here.
      className={`flex w-full ${isSender ? "justify-end" : "justify-start"} max-w-[85%] ${isSender ? "ml-auto" : "mr-auto"}`}
    >
      <div className={`flex w-full ${isSender ? "flex-row-reverse" : "flex-row"} ${isGrouped ? 'mt-0.5' : 'mt-4'} items-end`}>

        {/* Avatar (Recipient, start of group) */}
        {showAvatar && (
          <div className="chat-image avatar mx-1 flex-shrink-0">
            <div className="size-7 rounded-full border border-base-content/10">
              <img src={profilePic} alt="Profile pic" />
            </div>
          </div>
        )}
        {/* Placeholder for alignment when avatar is hidden */}
        {!showAvatar && !isSender && <div className="size-7 mx-1 flex-shrink-0"></div>}

        {/* Message Bubble - Allows the bubble to stretch up to 100% of the row's max-width */}
        <div 
          className={`
            chat-bubble text-sm p-3 shadow-md 
            ${bubbleClass} 
            ${isSender ? "rounded-l-2xl" : "rounded-r-2xl"}
            rounded-t-2xl 
            ${isSender ? "rounded-br-lg" : "rounded-bl-lg"}
            ${!isLastInGroup && 'mb-0.5'}
            max-w-full // Ensures the bubble uses the width of the containing div (max-w-[85%])
          `}
        >
          
          {/* Attached Image */}
          {message.image && (
            <img
              src={message.image}
              alt="Attachment"
              // Adjusted max image size to match the wider bubble
              className="max-w-full sm:max-w-xs rounded-lg mb-2 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              onClick={() => window.open(message.image, '_blank')}
            />
          )}
          
          {/* Text Content */}
          {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
          
          {/* Time & Read Status - Inside bubble, small and subtle */}
          <div className={`mt-1 flex items-center justify-${isSender ? 'end' : 'start'} text-xs font-light opacity-80 ${isSender ? 'text-primary-content/80' : 'text-base-content/60'}`}>
            <time className="mr-1">{formatMessageTime(message.createdAt)}</time>
            {isSender && (
              <CheckCheck className={`size-3 ${true ? 'text-green-300' : 'text-primary-content/50'}`} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
// --- End Sub-Component ---


const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  // ... (useEffect for fetching messages and auto-scroll remains the same)
  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
        const timer = setTimeout(() => {
            messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 50); 
        return () => clearTimeout(timer);
    }
  }, [messages]);


  const shouldGroup = (currentMessage, previousMessage) => {
    if (!previousMessage) return false;
    const sameSender = currentMessage.senderId === previousMessage.senderId;
    const timeDifference = new Date(currentMessage.createdAt) - new Date(previousMessage.createdAt);
    return sameSender && timeDifference < 120000;
  };
  
  const isNewDay = (currentMessage, previousMessage) => {
      if (!previousMessage) return true;
      const currentDay = new Date(currentMessage.createdAt).toDateString();
      const previousDay = new Date(previousMessage.createdAt).toDateString();
      return currentDay !== previousDay;
  }

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-base-100/70">
        
        {messages.length > 0 ? (
          messages.map((message, index) => {
            const isSender = message.senderId === authUser._id;
            const previousMessage = messages[index - 1];
            const isGrouped = shouldGroup(message, previousMessage);
            const isLastInGroup = (index === messages.length - 1) || !shouldGroup(messages[index + 1], message);
            const showDateDivider = isNewDay(message, previousMessage);

            return (
              <div key={message._id}>
                
                {showDateDivider && (
                    <div className="divider text-xs text-base-content/50 my-6">
                        {new Date(message.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'short', day: 'numeric'
                        })}
                    </div>
                )}
                
                <Message
                    message={message}
                    isSender={isSender}
                    selectedUser={selectedUser}
                    authUser={authUser}
                    isGrouped={isGrouped}
                    isLastInGroup={isLastInGroup}
                    lastMessageRef={index === messages.length - 1 ? messageEndRef : null} 
                />
              </div>
            );
          })
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-base-content/60">
                <p className="text-lg">Say hello! 👋</p>
                <p className="text-sm">This is the start of your conversation with {selectedUser.fullName || selectedUser.name}.</p>
            </div>
        )}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
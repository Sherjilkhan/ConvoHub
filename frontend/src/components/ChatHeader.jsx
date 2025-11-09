import { X, ArrowLeft, MoreVertical } from "lucide-react"; // Added ArrowLeft and MoreVertical
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const isOnline = onlineUsers.includes(selectedUser._id);
  const statusText = isOnline ? "Active now" : "Offline";
  const userFullName = selectedUser.fullName || selectedUser.name || "User"; // Handle potential missing fields

  return (
    // P-4 padding for better breathing room, higher z-index to float above content
    <div className="p-4 border-b border-base-300 bg-base-100 flex-shrink-0 z-10 shadow-sm">
      <div className="flex items-center justify-between">
        
        {/* Left Side: Back Button (Mobile) and User Info */}
        <div className="flex items-center gap-3">
          
          {/* Mobile Back Button (Replaces X on small screens) */}
          <button 
            onClick={() => setSelectedUser(null)}
            className="btn btn-ghost btn-circle sm:hidden" // Only visible on mobile/small screens
            aria-label="Back to contacts"
          >
            <ArrowLeft className="size-5" />
          </button>

          {/* User Info Container - Added hover effect to hint at profile viewing */}
          <div className="flex items-center gap-3 cursor-pointer hover:bg-base-200 p-1 rounded-lg transition-colors duration-150">
            
            {/* Avatar with Status Dot */}
            <div className="avatar">
              <div className="size-10 rounded-full relative">
                <img 
                  src={selectedUser.profilePic || "/avatar.png"} 
                  alt={userFullName} 
                  className="object-cover"
                />
                
                {/* Status Dot */}
                <span
                  className={`absolute bottom-0 right-0 size-3 rounded-full 
                    ring-2 ring-base-100 transition-colors duration-200
                    ${isOnline ? "bg-green-500" : "bg-base-content/30"}`}
                  title={statusText}
                />
              </div>
            </div>

            {/* User details */}
            <div>
              <h3 className="text-lg font-bold text-base-content leading-tight truncate max-w-[200px]">
                {userFullName}
              </h3>
              <p className={`text-xs ${isOnline ? "text-green-500 font-semibold" : "text-base-content/60"}`}>
                {statusText}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Options and Desktop Close Button */}
        <div className="flex items-center gap-1">
            {/* Options Button (Simulation) */}
            <button className="btn btn-ghost btn-circle" aria-label="Chat options">
                <MoreVertical className="size-5" />
            </button>
            
            {/* Desktop Close button */}
            <button 
                onClick={() => setSelectedUser(null)}
                className="btn btn-ghost btn-circle hidden sm:flex" // Hidden on mobile/small screens
                aria-label="Close chat"
            >
                <X className="size-5" />
            </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;
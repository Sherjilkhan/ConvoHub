import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search, Bot } from "lucide-react"; // Imported Search and Bot
import "../style.css";

const Sidebar = () => {
  const { getUsers, users, selectedUser, startChatWBot, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Exclude the current user from the online count (assuming your onlineUsers includes the current user)
  const onlineCount = onlineUsers.length > 0 ? onlineUsers.length - 1 : 0; 

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = users.filter((user) => {
    // Note: If you're excluding the current user in the initial 'users' list, 
    // you don't need to filter them out here. Assuming 'users' are only chat partners.
    const isOnline = showOnlineOnly ? onlineUsers.includes(user._id) : true;
    const matchesSearch =
      (user.fullName && user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return isOnline && matchesSearch;
  });

  // Helper component for a single user item
  const UserListItem = ({ user, onClick, isSelected, isOnline }) => {
    return (
      <button
        onClick={onClick}
        className={`
          flex items-center w-full py-3 pl-5 pr-4 gap-3 cursor-pointer transition-colors duration-150
          ${isSelected ? "bg-primary/10 text-primary" : "hover:bg-base-200"}
        `}
      >
        <div className="relative flex-shrink-0">
          <img
            src={user.profilePic || "/avatar.png"}
            alt={user.fullName || user.name || "User Avatar"}
            className="size-10 object-cover rounded-full" // Smaller avatar for cleaner list
          />
          {/* Online Status Dot */}
          {isOnline && (
            <span
              className="absolute bottom-0 right-0 size-2.5 bg-green-500 
              rounded-full ring-2 ring-base-100" // Ring color matches background for cleaner look
              title="Online"
            />
          )}
        </div>

        {/* User info - only visible on larger screens (w-72) */}
        <div className="hidden lg:block text-left flex-1 min-w-0">
          <div className={`font-semibold truncate ${isSelected ? 'text-primary' : 'text-base-content'}`}>
            {user.fullName || user.name}
          </div>
          <div className="text-xs text-base-content/60 truncate">
            {isOnline ? "Active now" : "Offline"}
          </div>
        </div>
      </button>
    );
  };


  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside
      className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200"
      id="sidebar"
    >
      {/* Header/Controls Area: Cleaned up spacing and design */}
      <div className="border-b border-base-300 w-full p-4 flex-shrink-0">
        
        {/* Title */}
        <div className="flex items-center justify-start lg:justify-start gap-3">
          <Users className="size-6 text-primary" />
          <span className="text-xl font-bold hidden lg:block">Contacts</span>
        </div>

        {/* Search Bar - Modernized */}
        <label className="input input-bordered input-sm flex items-center mt-4 h-9 w-full">
          <Search className="h-4 w-4 text-base-content/40 flex-shrink-0" />
          <input 
            type="text"
            className="grow text-sm focus:outline-none"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </label>

        {/* Online Filter Toggle - Cleaner alignment and text */}
        <div className="mt-3 hidden lg:flex items-center justify-between">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="toggle toggle-sm toggle-primary" // Use DaisyUI toggle for modern look
            />
            <span className="text-sm font-medium">Show Online Only</span>
          </label>
          <span className="text-sm text-base-content/50">
            ({onlineCount} online)
          </span>
        </div>
      </div>

      {/* Contact List Area */}
      <div className="overflow-y-auto w-full flex-1">
        
        {/* Dedicated Bot Contact (Always at the top) */}
        <button 
          onClick={() => startChatWBot()} 
          className="flex items-center w-full py-3 pl-5 pr-4 gap-3 border-b border-base-200/50 
          hover:bg-primary/5 transition-colors duration-150 font-medium text-primary"
        >
          <div className="relative flex-shrink-0">
            <img 
              src={"/nova.png"} 
              alt={"Nova Bot"} 
              className="size-10 object-cover rounded-full border-2 border-primary" 
            />
            <Bot className="absolute bottom-0 right-0 size-4 p-0.5 bg-primary text-base-100 rounded-full"/>
          </div>
          <div className="hidden lg:block text-left flex-1 min-w-0">
            <div className="font-bold truncate">Nova Bot</div> 
            <div className="text-xs text-primary/80 truncate">Start a new chat</div>
          </div>
        </button>

        {/* Mapped Users */}
        {filteredUsers.map((user) => (
          <UserListItem
            key={user._id}
            user={user}
            onClick={() => setSelectedUser(user)}
            isSelected={selectedUser?._id === user._id}
            isOnline={onlineUsers.includes(user._id)}
          />
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-base-content/60 py-8 px-4 text-sm">
            {showOnlineOnly ? "No users currently online matching your search." : "No users found."}
          </div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
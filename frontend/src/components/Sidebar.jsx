import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import "../style.css";



const Sidebar = () => {
  const { getUsers, users, selectedUser,startChatWBot, setSelectedUser, isUsersLoading } =
    useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers =users.filter((user) => {
    const isOnline = showOnlineOnly ? onlineUsers.includes(user._id) : true;
    const matchesSearch =
    (user.fullName && user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())); // Search by fullName or name
    return isOnline && matchesSearch;
  });

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside
      className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200"
      id="sidebar"
    >
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
        <label className="input input-bordered flex items-center mt-4 h-7 ">
          <input type="text"
            className="grow"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} />
          
        </label>
      </div>

      <div className="overflow-y-auto w-full py-3 sidebar">
      <button onClick={()=>startChatWBot()} className="badge w-full p-9 flex items-center justify-start gap-3 hover:bg-base-300 transition-colors ">
            <div className="relative mx-auto lg:mx-0">
              <img src={"/nova.png"} alt={""} className="size-12 object-cover rounded-full" />
            </div>
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">Nova</div>  
            </div>
          </button>
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              badge w-full p-9 flex items-center justify-start gap-3 
              hover:bg-base-300 transition-colors 
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300 "
                  : ""
              }
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic ||"/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;

import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
// Importing icons from lucide-react
import { LogOut, Menu, MessageSquare, Settings, User } from "lucide-react";
import "../style.css" // Assuming this contains custom styles or imports a theme

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      // Enhanced fixed header: Added `shadow-md` for better separation, used `navbar` class (if available in DaisyUI)
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
      backdrop-blur-lg bg-base-100/80 shadow-md transition-shadow duration-300" 
      id="navbar"
    >
      {/* Increased max-width and adjusted padding for better content spacing */}
      <div className="container mx-auto px-6 lg:px-8 h-16 sm:h-20"> 
        <div className="flex items-center justify-between h-full">
          
          {/* Left Section: Menu Toggle (Mobile) and Logo */}
          <div className="flex items-center gap-4"> 
            
            {/* Menu Button: Added DaisyUI `btn-ghost` for subtle styling and ARIA label */}
            {authUser && (
              <button 
                className="btn btn-ghost btn-circle lg:hidden" // Show only on large screens and up
                id="toggleBtn" 
                aria-label="Toggle Navigation Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}
            
            {/* Logo/App Name: Enhanced hover effect and typography */}
            <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
              <div className="size-8 rounded-full bg-primary flex items-center justify-center p-1 shadow-lg"> {/* Changed shape to circle and added shadow */}
                <MessageSquare className="w-5 h-5 text-base-100" fill="currentColor" /> {/* Icon color changed to white/base-100 */}
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-primary">Echo</h1> {/* Bolder, more prominent text */}
            </Link>
          </div>

          {/* Right Section: Navigation and Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Settings Link: Used `btn-ghost` for a less intrusive link, added focus style */}
            <Link
              to={"/settings"}
              className={`btn btn-sm btn-ghost gap-2 transition-colors duration-200 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
              aria-label="Go to Settings"
            >
              <Settings className="w-5 h-5" /> {/* Slightly larger icon */}
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                {/* Profile Link: Used `btn-ghost` */}
                <Link 
                  to={"/profile"} 
                  className={`btn btn-sm btn-ghost gap-2 transition-colors duration-200 hover:text-primary`}
                  aria-label="Go to Profile"
                >
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                {/* Logout Button: Used `btn-error` variant for visual separation, added an explicit button style */}
                <button 
                  className="btn btn-sm btn-error gap-2 text-base-100 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]" 
                  onClick={logout}
                  aria-label="Log out of Echo"
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;  
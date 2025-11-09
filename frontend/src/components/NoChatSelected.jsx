import { MessageSquare, ArrowLeft } from "lucide-react"; // Imported ArrowLeft for mobile hint
import "../style.css"; // Assuming this handles custom styles or utility imports

const NoChatSelected = () => {
  return (
    // 1. Full-flex container with a clean, slightly different background for depth
    <div className="w-full flex flex-1 flex-col items-center justify-center p-8 lg:p-16 bg-base-200/50">
      
      <div className="max-w-md text-center space-y-8">
        
        {/* Icon Display: Cleaned up animation and styling */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-3xl bg-primary/15 flex items-center justify-center 
              shadow-lg transform transition-all duration-500 ease-out 
              hover:scale-[1.02] animate-pulse-subtle" // Use a custom, subtle pulse animation
            >
              <MessageSquare className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>

        {/* Welcome Text - Stronger contrast and slightly larger */}
        <h2 className="text-4xl font-extrabold text-base-content tracking-tight">
          Welcome to Echo!
        </h2>
        <p className="text-lg text-base-content/70 max-w-xs mx-auto">
          It looks a bit empty here. Select a conversation from the sidebar to start chatting.
        </p>

        {/* Mobile Hint - Important UX for smaller screens */}
        <div className="sm:hidden pt-4 flex items-center justify-center text-primary/80">
            <ArrowLeft className="w-5 h-5 mr-2 animate-pulse" />
            <span className="text-sm font-medium">Tap a contact to begin</span>
        </div>

      </div>
      
      {/* Optional: Add a subtle graphic or texture if desired for more depth */}
      {/* <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('/path/to/subtle_pattern.svg')]"></div> */}
    </div>
  );
};

export default NoChatSelected;

// Note: If you want the pulse-subtle effect, you would need to define it in your style.css:
/*
@keyframes pulse-subtle {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(var(--p), 0.3); // Customize 'var(--p)' to your primary color
  }
  50% {
    box-shadow: 0 0 0 10px rgba(var(--p), 0);
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 3s infinite;
}
*/
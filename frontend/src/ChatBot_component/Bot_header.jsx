import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import Nova from "../assets/nova.png";
const Bot_header = () => {
  const {  EndChatWBot } = useChatStore();

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={Nova} alt={""} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">Nova</h3>
            <p className="text-sm text-base-content/70">
              
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => EndChatWBot()}>
          <X />
        </button>
      </div>
    </div>
  )
}

export default Bot_header
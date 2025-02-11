import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, SmilePlus, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false); // Control emoji picker visibility

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleEmojiPicker = () => {
    setEmojiPickerVisible((prev) => !prev);
  };

  // Function to add emoji to the message input
  const addEmoji = (emoji) => {
    setText((prevText) => prevText + emoji);
    setEmojiPickerVisible(false); // Hide emoji picker after selection
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <>
    {emojiPickerVisible && (
           <div className="emoji-picker-modal w-40 h-20 overflow-scroll  bg-dark p-1 rounded-lg border z-5">
          <div className="emoji-grid grid grid-cols-6 gap-2">
            {[
              "😊", "😂", "😍", "😎", "😘", "😁", "😒", "👍", "🙌", "🤞",
              "✌️", "🤷‍♂️", "🤦‍♂️", "😜", "💖", "💕", "🥰", "😗", "😉", 
              "🥲", "🫡", "🤨", "😶‍🌫️", "🤐", "😪", "🥱", "😴", "😥", 
              "😓", "🤑", "😭", "😨"
            ].map((emoji, index) => (
              <span
                key={index}
                className="emoji cursor-pointer text-lg"
                onClick={() => addEmoji(emoji)}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>
      )}
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      

      <form onSubmit={handleSendMessage} className="flex items-center gap-2 relative">
        <button type="button" onClick={toggleEmojiPicker} id="emoji-btn" className="text-xl">
        <SmilePlus />
        </button>

        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
    </>
  );
};

export default MessageInput;

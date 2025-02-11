import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
import axios from "axios"
const API_KEY = "AIzaSyCXZQ_D-472ApZOP5jSg7CH9OI4l3tnH2Y";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  getBot: false,
  

  startChatWBot:()=>{
    set({getBot:true})
    set({selectedUser:null})
    
    
  },
  EndChatWBot:()=>{
    set({getBot:false})
    
  },
  sendBot_Message: async (messageData) => {
    const { messages } = get();
    if (typeof messageData !== "string") {
      console.error("messageData should be a string but received:", messageData);
      toast.error("Invalid input format. Please enter a valid message.");
      return null;
    }
  
    const payload = {
      contents: [
        {
          parts: [{ text: messageData }],
        },
      ],
    };
  
    try {
      const response = await axios.post(URL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      console.log("Full API Response:", response.data);
  
      // Extract the bot's response correctly
      const answer = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from bot";
  
      // Add bot response to messages
      set({ messages: [...messages, answer] });
      
  
      return answer;
    } catch (error) {
      console.error("Error:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.error?.message || "Failed to get response from bot.");
      return null;
    }
  },
  





  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
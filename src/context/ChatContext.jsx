import { createContext, useContext, useEffect, useState } from "react";
import {
  getMessagesRequest,
  getUsersToChatRequest,
  sendMessageRequest,
} from "../api/chat";
import { Outlet } from "react-router-dom";

export const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within an ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);

  const sendMessage = async (data, receiver_id) => {
    try {
      const res = await sendMessageRequest(data, receiver_id);
      return res;
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    }
  };

  const getConversations = async () => {
    try {
      const res = await getUsersToChatRequest();
      return res.data;
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    }
  };

  const getMessages = async (id) => {
    try {
      const res = await getMessagesRequest(id);
      return res.data;
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <ChatContext.Provider
      value={{
        getConversations,
        getMessages,
        sendMessage,
        errors,
      }}
    >
      {children ?? <Outlet />}
    </ChatContext.Provider>
  );
};

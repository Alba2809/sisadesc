import { createContext, useContext, useEffect, useState } from "react";
import {
  getMessagesRequest,
  getUsersToChatRequest,
  sendMessageRequest,
} from "../api/chat";
import { Outlet } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { IoIosChatbubbles } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";

export const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within an ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { socket } = useSocket();
  const [errors, setErrors] = useState([]);
  const [messages, setMessages] = useState([]);
  const [userSelected, setUserSelected] = useState(null);

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
      setMessages(res.data);
      setUserSelected(id)
      return res.data;
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    }
  };

  useEffect(() => {
    socket?.on("message", ({ newMessage, receiver, sender }) => {
      /* alert with message icon */
      toast.success(`Nuevo mensaje de ${sender.firstname} ${sender.lastnamepaternal} ${sender.lastnamematernal}`, { icon: <IoIosChatbubbles color="green" /> });
      if(+receiver === userSelected || +sender.id === userSelected) setMessages([...messages, newMessage]);
    });

    return () => {
      socket?.off("message");
    };
  }, [socket, setMessages, messages]);

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
        setMessages,
        messages,
        errors,
      }}
    >
      <Toaster position="top-right" reverseOrder={false} />
      {children ?? <Outlet />}
    </ChatContext.Provider>
  );
};

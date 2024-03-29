import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { VITE_BACKEND_URL } from "../config";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const socket = io(VITE_BACKEND_URL, {
        query: {
          userId: user.id,
        },
      });
      setSocket(socket);

      return () => socket?.close();
    } else {
      if (socket) {
        socket?.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

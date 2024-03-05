import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { SocketProvider } from "./context/SocketContext.jsx";
import { PostProvider } from "./context/PostContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";
import { EventProvider } from "./context/EventContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <PostProvider>
            <EventProvider>
              <ChatProvider>
                <App />
              </ChatProvider>
            </EventProvider>
          </PostProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

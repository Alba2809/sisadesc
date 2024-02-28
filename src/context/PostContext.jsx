import { createContext, useContext, useEffect, useState } from "react";
import {
  getPostsRequest
} from "../api/post";
import { Outlet } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { BiSolidBellRing } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";

export const PostContext = createContext();

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePost must be used within an PostProvider");
  }
  return context;
};

export const PostProvider = ({ children }) => {
  const { socket } = useSocket();
  const [errors, setErrors] = useState([]);
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      const res = await getPostsRequest();
      setPosts(res.data);
      return res.data;
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    }
  };

  useEffect(() => {
    socket?.on("post", (newPost) => {
      toast.success(`Nuevo aviso publicado`, { icon: <BiSolidBellRing color="green" /> });
      setPosts([newPost, ...posts]);
    });

    return () => {
      socket?.off("post");
    };
  }, [socket, setPosts, posts]);

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <PostContext.Provider
      value={{
        getPosts,
        setPosts,
        posts,
        errors,
      }}
    >
      <Toaster position="top-right" reverseOrder={false} />
      {children ?? <Outlet />}
    </PostContext.Provider>
  );
};

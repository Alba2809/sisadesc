import { useState } from "react";
import {
  deletePostRequest,
  getPostRequest,
  getPostsRequest,
  registerPostRequest,
  updatePostRequest,
} from "../api/post";
import toast from "react-hot-toast";

export function usePost({ setValue } = {}) {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [errors, setErrors] = useState([]);

  const registerPost = async (data) => {
    try {
      const res = await toast.promise(registerPostRequest(data), {
        loading: "Registrando aviso...",
        success: "¡Aviso registrado!",
        error: "¡Error al registrar aviso!",
      });
      return res;
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    }
  };

  const updatePost = async (id, data) => {
    try {
      const res = await toast.promise(updatePostRequest(id, data), {
        loading: "Actualizando aviso...",
        success: "¡Aviso actualizado!",
        error: "¡Error al actualizar aviso!",
      });
      return res;
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
        array.map((error) => toast.error(error));
      } else{
        setErrors(error.response.data);
        error.response.data.map((error) => toast.error(error));
      }
    }
  };

  const getPost = async (id) => {
    try {
      setLoading(true);
      const resPost = await getPostRequest(id);
      const postData = resPost.data;
      setPost(postData);
      if(setValue){
        setValue("title", postData.title);
        setValue("description", postData.description);
      }
      return postData;
    } catch (error) {
      toast.error("Error al obtener el aviso.");
    } finally {
      setLoading(false);
    }
  };

  const getPosts = async () => {
    try {
      setLoading(true);
      const resPosts = await getPostsRequest();
      if (resPosts.data) setPosts(resPosts.data);
      return resPosts.data;
    } catch (error) {
      toast.error("Error al obtener los avisos.");
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id) => {
    try {
      const res = await toast.promise(deletePostRequest(id), {
        loading: "Eliminando aviso...",
        success: "¡Aviso eliminado!",
        error: "¡Error al eliminar el aviso!",
      });

      return res;
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    }
  };

  const handleDialog = (object) => {
    setPostToDelete(object);
    setShowDialog((prev) => !prev);
  };

  return {
    loading,
    errors,
    posts,
    setPosts,
    registerPost,
    showDialog,
    postToDelete,
    handleDialog,
    getPosts,
    deletePost,
    updatePost,
    getPost,
    post
  };
}

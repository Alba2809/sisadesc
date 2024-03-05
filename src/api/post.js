import axios from "./axios";

export const registerPostRequest = (data) =>
  axios.post(`/post/posts`, data);

export const updatePostRequest = (id, data) =>
  axios.put(`/post/posts/${id}`, data);

export const deletePostRequest = (id) => axios.delete(`/post/posts/${id}`);

export const getPostsRequest = () => axios.get("/post/posts");

export const getPostRequest = (id) => axios.get(`/post/posts/${id}`);

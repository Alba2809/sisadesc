import axios from "./axios";

export const getSubjectsRequest = () => axios.get("/secretary/subjects");

export const getSubjectStudentsRequest = (id) => axios.get(`/secretary/subjects/${id}`);

export const getGradesSubjectRequest = (id) => axios.get(`/secretary/grades/${id}`);

export const registerGradesRequest = (data) => axios.post(`/secretary/grades`, data);

export const updateGradesRequest = (data) => axios.put(`/secretary/grades`, data);

export const registerPostRequest = (data) => axios.post(`/secretary/posts`, data);

export const updatePostRequest = (id, data) => axios.put(`/secretary/posts/${id}`, data);

export const deletePostRequest = (id) => axios.delete(`/secretary/posts/${id}`);

export const getPostsRequest = () => axios.get("/secretary/posts");

export const getPostRequest = (id) => axios.get(`/secretary/posts/${id}`);
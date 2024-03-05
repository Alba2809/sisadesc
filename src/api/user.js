import axios from "./axios";

export const registerUserRequest = (data) => axios.post("/user/registeruser", data);

export const updateUserRequest = (id, data) => axios.put(`/user/updateuser/${id}`, data);

export const getUserRequest = (id) => axios.get(`/user/getuser/${id}`);

export const getUsersRequest = () => axios.get("/user/getusers");

export const deleteUserRequest = (id) => axios.delete(`/user/deleteuser/${id}`);
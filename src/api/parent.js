import axios from "./axios";

export const registerFatherRequest = (data) => axios.post("/parent/registerfather", data);

export const registerMotherRequest = (data) => axios.post("/parent/registermother", data);

export const registerTutorRequest = (data) => axios.post("/parent/registertutor", data);

export const registerParentRequest = (data) => axios.post("/parent/registerparent", data)

export const updateParentRequest = (id, data) => axios.put(`/parent/updateparent/${id}`, data);

export const getParentRequest = (id) => axios.get(`/parent/getparent/${id}`);

export const getParentsRequest = () => axios.get("/parent/getparents");

export const deleteParentRequest = (id) => axios.delete(`/parent/deleteparent/${id}`);

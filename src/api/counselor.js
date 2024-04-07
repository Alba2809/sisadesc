import axios from "./axios";

export const getCounselorsRequest = () => axios.get("/counselor");

export const createCounselorRequest = (data) => axios.post("/counselor", data);

export const getCounselorRequest = (id) => axios.get(`/counselor/${id}`);

export const updateCounselorRequest = (id, data) => axios.put(`/counselor/${id}`, data);

export const deleteCounselorRequest = (id) => axios.delete(`/counselor/${id}`);
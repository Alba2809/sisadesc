import axios from "./axios";

export const getSubjectsRequest = () => axios.get("/teacher/subjects");

export const getAssistsSubjectRequest = (id) => axios.get(`/teacher/assists/${id}`);

export const registerAssistsRequest = (data) => axios.post(`/teacher/assists`, data);

import axios from "./axios";

export const getGradesSubjectRequest = (id) => axios.get(`/grade/grades/${id}`);

export const registerGradesRequest = (data) => axios.post(`/grade/grades`, data);

export const updateGradesRequest = (data) => axios.put(`/grade/grades`, data);
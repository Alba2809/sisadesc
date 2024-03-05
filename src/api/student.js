import axios from "./axios";

export const registerStudentRequest = (data) => axios.post("/student/registerstudent", data);

export const updateStudentRequest = (id, data) => axios.put(`/student/updatestudent/${id}`, data);

export const getStudentRequest = (id) => axios.get(`/student/getstudent/${id}`);

export const getStudentsRequest = () => axios.get("/student/getstudents");

export const deleteStudentRequest = (id) => axios.delete(`/student/deletestudent/${id}`);

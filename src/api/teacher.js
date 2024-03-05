import axios from "./axios";

export const registerTeacherRequest = (data) => axios.post("/teacher/registerteacher", data);

export const updateTeacherRequest = (id, data) => axios.put(`/teacher/updateteacher/${id}`, data);

export const getTeacherRequest = (id) => axios.get(`/teacher/getteacher/${id}`);

export const getTeachersRequest = () => axios.get("/teacher/getteachers");

export const deleteTeacherRequest = (id) => axios.delete(`/teacher/deleteteacher/${id}`);
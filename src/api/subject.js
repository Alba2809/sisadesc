import axios from "./axios";

export const registerSubjectRequest = (data) =>
  axios.post("/subject/registersubject", data);

export const updateSubjectRequest = (id, data) =>
  axios.put(`/subject/updatesubject/${id}`, data);

export const updateStatusSubjectRequest = (id) =>
  axios.put(`/subject/updatestatussubject/${id}`);

export const getSubjectRequest = (id) => axios.get(`/subject/getsubject/${id}`);

export const getSubjectStudentsRequest = (id) =>
  axios.get(`/subject/getsubjectstudents/${id}`);

export const getSubjectsRequest = () => axios.get("/subject/getsubjects");

export const getSubjectsOfTeacherRequest = () => axios.get("/subject/getsubjectsOfTeacher");

export const deleteSubjectRequest = (id) =>
  axios.delete(`/subject/deletesubject/${id}`);

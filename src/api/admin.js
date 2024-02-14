import axios from "./axios";

export const registerUserRequest = (data) => axios.post("/admin/registeruser", data);

export const registerTeacherRequest = (data) => axios.post("/admin/registerteacher", data);

export const registerStudentRequest = (data) => axios.post("/admin/registerstudent", data);

export const registerFatherRequest = (data) => axios.post("/admin/registerfather", data);

export const registerMotherRequest = (data) => axios.post("/admin/registermother", data);

export const registerTutorRequest = (data) => axios.post("/admin/registertutor", data);

export const registerSubjectRequest = (data) => axios.post("/admin/registersubject", data);

export const updateUserRequest = (id, data) => axios.put(`/admin/updateuser/${id}`, data);

export const updateTeacherRequest = (id, data) => axios.put(`/admin/updateteacher/${id}`, data);

export const updateStudentRequest = (id, data) => axios.put(`/admin/updatestudent/${id}`, data);

export const updateFatherRequest = (id, data) => axios.put(`/admin/updatefather/${id}`, data);

export const updateMotherRequest = (id, data) => axios.put(`/admin/updatemother/${id}`, data);

export const updateTutorRequest = (id, data) => axios.put(`/admin/updatetutor/${id}`, data);

export const updateSubjectRequest = (id, data) => axios.put(`/admin/updatesubject/${id}`, data);

export const getUserRequest = (id) => axios.get(`/admin/getuser/${id}`);

export const getTeacherRequest = (id) => axios.get(`/admin/getteacher/${id}`);

export const getStudentRequest = (id) => axios.get(`/admin/getstudent/${id}`);

export const getParentRequest = (id) => axios.get(`/admin/getparent/${id}`);

export const getSubjectRequest = (id) => axios.get(`/admin/getsubject/${id}`);

export const getUsersRequest = () => axios.get("/admin/getusers");

export const getTeachersRequest = () => axios.get("/admin/getteachers");

export const getStudentsRequest = () => axios.get("/admin/getstudents");

export const getParentsRequest = () => axios.get("/admin/getparents");

export const getSubjectsRequest = () => axios.get("/admin/getsubjects");

export const getRolesRequest = () => axios.get("/admin/getroles");

export const getAddressesRequest = () => axios.get("/admin/getaddresses");

export const deleteUserRequest = (id) => axios.delete(`/admin/deleteuser/${id}`);

export const deleteTeacherRequest = (id) => axios.delete(`/admin/deleteteacher/${id}`);

export const deleteStudentRequest = (id) => axios.delete(`/admin/deletestudent/${id}`);

export const deleteParentRequest = (id) => axios.delete(`/admin/deleteparent/${id}`);

export const deleteSubjectRequest = (id) => axios.delete(`/admin/deletesubject/${id}`);
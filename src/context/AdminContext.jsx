import { createContext, useContext, useEffect, useState } from "react";
import {
  registerStudentRequest,
  registerSubjectRequest,
  registerTeacherRequest,
  registerUserRequest,
  updateStudentRequest,
  updateSubjectRequest,
  updateTeacherRequest,
  updateUserRequest,
  getStudentRequest,
  getStudentsRequest,
  getSubjectRequest,
  getSubjectsRequest,
  getTeacherRequest,
  getTeachersRequest,
  getUserRequest,
  getUsersRequest,
  deleteStudentRequest,
  deleteSubjectRequest,
  deleteTeacherRequest,
  deleteUserRequest,
  getRolesRequest
} from "../api/admin";
import { Outlet } from "react-router-dom";

export const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export const AdminProvider = ({children}) => {
  const [errors, setErrors] = useState([]);

  const registerSomething = async (data, type) => {
    try {
      if (type === "user") {
        const res = await registerUserRequest(data);
        return res;
      }
      if (type === "teacher") {
        const res = await registerTeacherRequest(data);
        return res;
      }
      if (type === "student") {
        const res = await registerStudentRequest(data);
        return res;
      }
      if (type === "subject") {
        const res = await registerSubjectRequest(data);
        return res;
      }
      return false;
    } catch (error) {
      if(typeof error.response.data === "object" && error.response.data){
        const array = Object.values(error.response.data)
        setErrors(array);
      }
      else setErrors(error.response.data);
    }
  };

  const updateSomething = async (id, data, type) => {
    try {
      if (type === "user") {
        const res = await updateUserRequest(id, data);
        return res;
      }
      if (type === "teacher") {
        const res = await updateTeacherRequest(id, data);
        return res;
      }
      if (type === "student") {
        const res = await updateStudentRequest(id, data);
        return res;
      }
      if (type === "subject") {
        const res = await updateSubjectRequest(id, data);
        return res;
      }
      return false;
    } catch (error) {
      if(typeof error.response.data === "object" && error.response.data){
        const array = Object.values(error.response.data)
        setErrors(array);
      }
      else setErrors(error.response.data);
    }
  };

  const getOneSomething = async (id, type) => {
    try {
      if (type === "user") {
        const res = await getUserRequest(id);
        return res.data;
      }
      if (type === "teacher") {
        const res = await getTeacherRequest(id);
        return res.data;
      }
      if (type === "student") {
        const res = await getStudentRequest(id);
        return res.data;
      }
      if (type === "subject") {
        const res = await getSubjectRequest(id);
        return res.data;
      }
      return false;
    } catch (error) {}
  };

  const getAllSomething = async (type) => {
    try {
      if (type === "user") {
        const res = await getUsersRequest();
        return res.data;
      }
      if (type === "teacher") {
        const res = await getTeachersRequest();
        return res.data;
      }
      if (type === "student") {
        const res = await getStudentsRequest();
        return res.data;
      }
      if (type === "subject") {
        const res = await getSubjectsRequest();
        return res.data;
      }
      if (type === "role") {
        const res = await getRolesRequest();
        return res.data;
      }
      return false;
    } catch (error) {}
  };

  const deleteSomething = async (id, type) => {
    try {
      if (type === "user") {
        const res = await deleteUserRequest(id);
        return res.data;
      }
      if (type === "teacher") {
        const res = await deleteTeacherRequest(id);
        return res.data;
      }
      if (type === "student") {
        const res = await deleteStudentRequest(id);
        return res.data;
      }
      if (type === "subject") {
        const res = await deleteSubjectRequest(id);
        return res.data;
      }
      return false;
    } catch (error) {
      
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <AdminContext.Provider
      value={{
        registerSomething,
        updateSomething,
        getOneSomething,
        getAllSomething,
        deleteSomething,
        errors,
      }}
    >
      {children ?? <Outlet />}
    </AdminContext.Provider>
  );
};

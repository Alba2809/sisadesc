import { createContext, useContext, useEffect, useState } from "react";
import {
  getAssistsSubjectRequest,
  getGradesSubjectRequest,
  getSubjectsRequest,
  registerAssistsRequest,
  registerGradesRequest,
} from "../api/teacher";
import { Outlet } from "react-router-dom";

export const TeacherContext = createContext();

export const useTeacher = () => {
  const context = useContext(TeacherContext);
  if (!context) {
    throw new Error("useTeacher must be used within an TeacherProvider");
  }
  return context;
};

export const TeacherProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);

  const getAllSomething = async (type) => {
    try {
      if (type === "subject") {
        const res = await getSubjectsRequest();
        return res.data;
      }
      return false;
    } catch (error) {}
  };

  const getOneSomething = async (id, type) => {
    try {
      if (type === "assists") {
        const res = await getAssistsSubjectRequest(id);
        return res.data;
      }
      if(type === "grades") {
        const res = await getGradesSubjectRequest(id);
        return res.data;
      }
      return false;
    } catch (error) {}
  };

  const registerSomething = async (data, type) => {
    try {
      if (type === "assists") {
        const res = await registerAssistsRequest(data);
        return res;
      }
      if(type === "grades") {
        const res = await registerGradesRequest(data);
        return res;
      }
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
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
    <TeacherContext.Provider
      value={{
        getAllSomething,
        getOneSomething,
        registerSomething,
        errors,
      }}
    >
      {children ?? <Outlet />}
    </TeacherContext.Provider>
  );
};

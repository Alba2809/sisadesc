import { createContext, useContext, useEffect, useState } from "react";

import { Outlet } from "react-router-dom";
import { getSubjectStudentsRequest, getSubjectsOfTeacherRequest } from "../api/subject";
import { getGradesSubjectRequest } from "../api/grade";

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
        const res = await getSubjectsOfTeacherRequest();
        return res.data;
      }      
      return false;
    } catch (error) {}
  };

  const getOneSomething = async (id, type) => {
    try {
      if(type === "grades") {
        const res = await getGradesSubjectRequest(id);
        return res.data;
      }
      if (type === "student") {
        const res = await getSubjectStudentsRequest(id);
        return res.data;
      }
      return false;
    } catch (error) {}
  };

  const registerSomething = async (data, type) => {
    try {
      return true
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

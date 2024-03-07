import { createContext, useContext, useEffect, useState } from "react";

import { Outlet } from "react-router-dom";
import {
  getSubjectRequest,
  getSubjectStudentsRequest,
  getSubjectsRequest,
  updateStatusSubjectRequest,
  updateSubjectRequest,
} from "../api/subject";
import {
  getGradesSubjectRequest,
  registerGradesRequest,
  updateGradesRequest,
} from "../api/grade";
import {
  deletePostRequest,
  getPostRequest,
  getPostsRequest,
  registerPostRequest,
  updatePostRequest,
} from "../api/post";
import {
  deleteTeacherRequest,
  getTeacherRequest,
  getTeachersRequest,
  registerTeacherRequest,
  updateTeacherRequest,
} from "../api/teacher";
import { getAddressesRequest } from "../api/address";
import { getStudentsRequest } from "../api/student";

export const ViceprincipalContext = createContext();

export const useViceprincipal = () => {
  const context = useContext(ViceprincipalContext);
  if (!context) {
    throw new Error(
      "useViceprincipal must be used within an ViceprincipalProvider"
    );
  }
  return context;
};

export const ViceprincipalProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);

  const getAllSomething = async (type) => {
    try {
      if (type === "subject") {
        const res = await getSubjectsRequest();
        return res.data;
      }
      if (type === "post") {
        const res = await getPostsRequest();
        return res.data;
      }
      if (type === "teacher") {
        const res = await getTeachersRequest();
        return res.data;
      }
      if (type === "address") {
        const res = await getAddressesRequest();
        return res.data;
      }
      if (type === "student") {
        const res = await getStudentsRequest();
        return res.data;
      }
      return false;
    } catch (error) {}
  };

  const getOneSomething = async (id, type) => {
    try {
      if (type === "grades") {
        const res = await getGradesSubjectRequest(id);
        return res.data;
      }
      if (type === "student") {
        const res = await getSubjectStudentsRequest(id);
        return res.data;
      }
      if (type === "post") {
        const res = await getPostRequest(id);
        return res.data;
      }
      if (type === "teacher") {
        const res = await getTeacherRequest(id);
        return res.data;
      }
      if (type === "subjectstudents") {
        const res = await getSubjectStudentsRequest(id);
        return res.data;
      }
      if (type === "subject") {
        const res = await getSubjectRequest(id);
        return res.data;
      }
      return false;
    } catch (error) {}
  };

  const registerSomething = async (data, type) => {
    try {
      if (type === "grades") {
        const res = await registerGradesRequest(data);
        return res;
      }
      if (type === "post") {
        const res = await registerPostRequest(data);
        return res;
      }
      if (type === "teacher") {
        const res = await registerTeacherRequest(data);
        return res;
      }
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    }
  };

  const updateSomething = async (data, type, id) => {
    try {
      if (type === "grades") {
        const res = await updateGradesRequest(data);
        return res;
      }
      if (type === "post") {
        const res = await updatePostRequest(id, data);
        return res;
      }
      if (type === "teacher") {
        const res = await updateTeacherRequest(id, data);
        return res;
      }
      if (type === "subject") {
        const res = await updateSubjectRequest(id, data);
        return res;
      }
      if (type === "statusSubject") {
        const res = await updateStatusSubjectRequest(id);
        return res;
      }
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    }
  };

  const deleteSomething = async (id, type) => {
    try {
      if (type === "post") {
        const res = await deletePostRequest(id);
        return res;
      }
      if (type === "teacher") {
        const res = await deleteTeacherRequest(id);
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
    <ViceprincipalContext.Provider
      value={{
        getAllSomething,
        getOneSomething,
        registerSomething,
        updateSomething,
        deleteSomething,
        errors,
      }}
    >
      {children ?? <Outlet />}
    </ViceprincipalContext.Provider>
  );
};
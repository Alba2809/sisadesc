import { createContext, useContext, useEffect, useState } from "react";
import {
  registerGradesRequest,
  getGradesSubjectRequest,
  getSubjectsRequest,
  getSubjectStudentsRequest,
  updateGradesRequest,
  updatePostRequest,
  registerPostRequest,
  getPostsRequest,
  deletePostRequest,
  getPostRequest,
} from "../api/secretary";
import { Outlet } from "react-router-dom";

export const SecretaryContext = createContext();

export const useSecretary = () => {
  const context = useContext(SecretaryContext);
  if (!context) {
    throw new Error("useSecretary must be used within an SecretaryProvider");
  }
  return context;
};

export const SecretaryProvider = ({ children }) => {
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
    <SecretaryContext.Provider
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
    </SecretaryContext.Provider>
  );
};

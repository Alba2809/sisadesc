import { createContext, useContext, useEffect, useState } from "react";

import { Outlet } from "react-router-dom";
import {
  deleteEventRequest,
  getEventsRequest,
  getEventByDateRequest,
  getEventByIdRequest,
  registerEventRequest,
  updateEventRequest,
} from "../api/event";

export const AcademicContext = createContext();

export const useAcademic = () => {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error("useAcademic must be used within an AcademicProvider");
  }
  return context;
};

export const AcademicProvider = ({ children }) => {
  const [errors, setErrors] = useState([]);

  const getAllSomething = async (type) => {
    try {
      if (type === "events") {
        const res = await getEventsRequest();
        return res.data;
      }
      return false;
    } catch (error) {
    }
  };

  const getOneSomething = async (id, type) => {
    try {
      if (type === "eventsId") {
        const res = await getEventByIdRequest(id);
        return res.data;
      }
      if (type === "eventsDate") {
        const res = await getEventByDateRequest(id);
        return res.data;
      }
      return false;
    } catch (error) {}
  };

  const registerSomething = async (data, type) => {
    try {
      if (type === "events") {
        const res = await registerEventRequest(data);
        return res;
      }
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    }
  };

  const updateSomething = async (id, data, type) => {
    try {
      if (type === "events") {
        const res = await updateEventRequest(id, data);
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
      if (type === "events") {
        const res = await deleteEventRequest(id);
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
    <AcademicContext.Provider
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
    </AcademicContext.Provider>
  );
};

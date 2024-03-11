import { createContext, useContext, useEffect, useState } from "react";
import { getEventsRequest } from "../api/event";
import { Outlet } from "react-router-dom";
import { useSocket } from "../context/SocketContext";

export const EventContext = createContext();

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const { socket } = useSocket();
  const [errors, setErrors] = useState([]);
  const [events, setEvents] = useState([]);

  const getEvents = async () => {
    try {
      const res = await getEventsRequest();
      setEvents(res.data);
      return res.data;
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
    }
  };

  useEffect(() => {
    socket?.on("newEvent", (newEvent) => {
      setEvents([...events, newEvent]);
    });

    socket?.on("updateEvent", (updateEvent) => {
      const index = events.findIndex((event) => event.id === updateEvent.id);
      if (index !== -1) {
        const newEvents = [...events];
        newEvents[index] = updateEvent;
        setEvents(newEvents);
      }
    });

    socket?.on("deleteEvent", (eventId) => {
      const index = events.findIndex((event) => +event.id === +eventId);
      if (index !== -1) {
        const newEvents = [...events];
        newEvents.splice(index, 1);
        setEvents(newEvents);
      }
    });

    return () => {
      socket?.off("post");
    };
  }, [socket, setEvents, events]);

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  return (
    <EventContext.Provider
      value={{
        getEvents,
        setEvents,
        events,
        errors,
      }}
    >
      {children ?? <Outlet />}
    </EventContext.Provider>
  );
};

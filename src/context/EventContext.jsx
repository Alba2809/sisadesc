import { createContext, useContext, useEffect, useState } from "react";
import { getEventsRequest } from "../api/event";
import { Outlet } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { FaRegCalendarAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { set } from "react-hook-form";

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
  const [eventUpdated, setEventUpdated] = useState(null);
  const [eventAdded, setEventAdded] = useState(null);
  const [eventDeleted, setEventDeleted] = useState(null);

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
      setEventAdded(newEvent);
    });

    socket?.on("updateEvent", (updateEvent) => {
      const index = events.findIndex((event) => event.id === updateEvent.id);
      if (index !== -1) {
        const newEvents = [...events];
        newEvents[index] = updateEvent;
        setEvents(newEvents);
        setEventUpdated(updateEvent);
      }
    });

    socket?.on("deleteEvent", (eventId) => {
      const index = events.findIndex((event) => +event.id === +eventId);
      if (index !== -1) {
        const newEvents = [...events];
        newEvents.splice(index, 1);
        setEvents(newEvents);
        setEventDeleted(eventId);
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
        setEventUpdated,
        setEventAdded,
        setEventDeleted,
        events,
        eventUpdated,
        eventAdded,
        eventDeleted,
        errors,
      }}
    >
      {children ?? <Outlet />}
    </EventContext.Provider>
  );
};

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
  const [loading, setLoading] = useState(false);

  const getEvents = async () => {
    try {
      setLoading(true);
      const res = await getEventsRequest();
      setEvents(res.data);
      setLoading(false);
      return res.data;
    } catch (error) {
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
      } else setErrors(error.response.data);
      setLoading(false);
    }
  };

  useEffect(() => {
    socket?.on("newEvent", (newEvent) => {
      setLoading(true);
      toast.success(`Nuevo evento registrado`, {
        icon: <FaRegCalendarAlt color="green" />,
      });
      setEvents([...events, newEvent]);
      if (loading) setLoading(false);
    });

    socket?.on("updateEvent", (updateEvent) => {
      setLoading(true);
      const index = events.findIndex((event) => event.id === updateEvent.id);
      if (index !== -1) {
        const newEvents = [...events];
        newEvents[index] = updateEvent;
        setEvents(newEvents);
        setEventUpdated(updateEvent);
      }
      if (loading) setLoading(false);
    });

    socket?.on("deleteEvent", (eventId) => {
      setLoading(true);
      const index = events.findIndex((event) => +event.id === +eventId);
      if (index !== -1) {
        const newEvents = [...events];
        newEvents.splice(index, 1);
        setEvents(newEvents);
      }
      if (loading) setLoading(false);
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
        events,
        eventUpdated,
        errors,
      }}
    >
      {children ?? <Outlet />}
    </EventContext.Provider>
  );
};

import { useState } from "react";
import {
  deleteEventRequest,
  getEventsRequest,
  registerEventRequest,
  updateEventRequest,
} from "../api/event";
import toast from "react-hot-toast";
import { formatDateShort } from "../utils/functions";

export function useEventCalendar({ setValue, getValues }) {
  const [loading, setLoading] = useState();
  const [events, setEvents] = useState();
  const [eventsSelect, setEventsSelect] = useState();
  const [errors, setErrors] = useState([]);

  const getEvents = async () => {
    try {
      setLoading(true);
      const res = await getEventsRequest();
      setEvents(res.data);
      return res.data;
    } catch (error) {
      toast.error("Error al buscar los eventos");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDay = (date) => {
    const haveEvents = events?.some(
      (event) => formatDateShort(event.date) === formatDateShort(date)
    );
    if (haveEvents) {
      const eventsFound = events?.filter(
        (event) => formatDateShort(event.date) === formatDateShort(date)
      );
      setEventsSelect(eventsFound);
    } else {
      setEventsSelect([]);
    }
    setValue("date", formatDateShort(date));
  };

  const handleAddEvent = async () => {
    const eventsLength = eventsSelect?.length;
    if (eventsLength === 5) {
      toast.error("No se pueden agregar más de 5 eventos a la misma fecha.");
      return;
    }
    try {
      const dataEvent = {
        date: getValues("date"),
        description: getValues("newDescription"),
        start_time: getValues("newStart_time"),
        end_time: getValues("newEnd_time"),
      };

      if (
        dataEvent.description === "" ||
        dataEvent.start_time === "" ||
        dataEvent.end_time === ""
      )
        return toast.error("Faltam campos por llenar.");

      const res = await registerEventRequest(dataEvent);

      toast.success("Evento registrado correctamente.");
      const newEvents = [...events, res.data];
      setEvents(newEvents);
      setEventsSelect([...eventsSelect, res.data]);
      setValue("newDescription", "");
      setValue("newStart_time", "");
      setValue("newEnd_time", "");
    } catch (error) {
      toast.error("No se pudo registrar el evento intentelo de nuevo.");
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
        array.map((error) => toast.error(error));
      } else {
        setErrors(error.response.data);
        error.response.data.map((error) => toast.error(error));
      }
    }
  };

  const handleEditEvent = async (id) => {
    try {
      const dataEvent = {
        date: getValues("date"),
        description: getValues("description" + id),
        start_time: getValues("start_time" + id),
        end_time: getValues("end_time" + id),
      };

      if (
        dataEvent.description === "" ||
        dataEvent.start_time === "" ||
        dataEvent.end_time === ""
      )
        return toast.error("Faltan campos por rellenar.");

      const res = await toast.promise(updateEventRequest(id, dataEvent), {
        loading: "Actualizando evento...",
        success: "¡Evento actualizado!",
        error: "¡Error al actualizar!",
      });
    } catch (error) {
      toast.error("No se pudo actualizar el evento intentelo de nuevo.");
      if (typeof error.response.data === "object" && error.response.data) {
        const array = Object.values(error.response.data);
        setErrors(array);
        array.map((error) => toast.error(error));
      } else {
        setErrors(error.response.data);
        error.response.data.map((error) => toast.error(error));
      }
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      const res = await deleteEventRequest(id);

      toast.success("Evento eliminado correctamente.");
      const newEvents = events.filter((event) => event.id !== id);
      setEvents(newEvents);
      const newEventsSelect = eventsSelect.filter((event) => event.id !== id);
      setEventsSelect(newEventsSelect);
    } catch (error) {
      toast.error("No se pudo eliminar el evento intentelo de nuevo.");
    }
  };

  return {
    events,
    eventsSelect,
    loading,
    getEvents,
    handleAddEvent,
    handleDeleteEvent,
    handleEditEvent,
    handleSelectDay,
  };
}

import { useEffect, useRef, useState } from "react";
import { formatDateShort } from "@constants/functions";
import { useAcademic } from "@context/AcademicContext";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import AlertMessage from "@components/AlertMessage";
import toast from "react-hot-toast";
import Calendar from "react-calendar";
import "@styles/calendar.css";

function Events() {
  const {
    getAllSomething,
    registerSomething,
    updateSomething,
    deleteSomething,
    errors: eventErrors,
  } = useAcademic();
  const [loading, setLoading] = useState(true);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [events, setEvents] = useState([]);
  const [eventSelect, setEventSelect] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const calendarRef = useRef();

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const formattedDate = date.toISOString().split("T")[0];
      const hasEvents = events?.some(
        (event) => formatDateShort(event.date) === formattedDate
      );
      return hasEvents ? (
        <div className="size-3 absolute top-[20%] right-[35%] bg-red-600 rounded-full animate-bounce"></div>
      ) : null;
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const formattedDate = date.toISOString().split("T")[0];
      const hasEvents = events?.some(
        (event) => formatDateShort(event.date) === formattedDate
      );
      return hasEvents ? "relative" : "";
    }
    return "";
  };

  const onClickDay = (date) => {
    const haveEvents = events?.some(
      (event) => formatDateShort(event.date) === formatDateShort(date)
    );
    if (haveEvents) {
      const eventFound = events?.find(
        (event) => formatDateShort(event.date) === formatDateShort(date)
      );
      setEventSelect(eventFound);
      setValue("description", eventFound?.description);
      setShowUpdate(true);
      setShowDelete(true);
      setShowRegister(false);
    } else {
      setEventSelect(null);
      setValue("description", "");
      setShowRegister(true);
      setShowUpdate(false);
      setShowDelete(false);
    }
    setValue("date", formatDateShort(date));
  };

  useEffect(() => {
    async function getEvents() {
      const eventsData = await getAllSomething("events");
      setEvents(eventsData);
      setLoading(false);
    }
    if (loading) getEvents();
  }, [loading]);

  const onSubmit = handleSubmit(async (data, action) => {
    try {
      if (action === "register") {
        const res = await registerSomething(data, "events");
        if (res?.statusText === "OK") {
          toast.success("Evento registrado correctamente.");
          const newEvents = [...events, res.data];
          setEvents(newEvents);
          setLoadingAdd(true);
        }
      }
      if (action === "update" && eventSelect) {
        const res = await updateSomething(eventSelect?.id, data, "events");
        if (res?.statusText === "OK") {
          toast.success("Evento actualizado correctamente.");
          const eventIndex = events?.findIndex(
            (event) => event?.id === eventSelect?.id
          );
          if (eventIndex !== -1) {
            const newEvents = events;
            newEvents[eventIndex].description = data.description;
            setEvents(newEvents);
          }
        }
      }
      if (action === "delete" && eventSelect) {
        const res = await deleteSomething(eventSelect?.id, "events");
        if (res?.statusText === "OK") {
          toast.success("Evento eliminado correctamente.");
          const eventIndex = events?.findIndex(
            (event) => event?.id === eventSelect?.id
          );
          if (eventIndex !== -1) {
            const newEvents = events;
            newEvents.splice(eventIndex, 1);
            setEvents(newEvents);
          }
          setValue("description", "");
        }
      }
    } catch (error) {
      toast.error("Ha ocurrido un error al actualizar el evento.");
    }
  });

  return (
    <div className="w-full h-full flex flex-col">
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">
          Lista de eventos
        </h1>
      </header>
      <section className="flex-1 flex flex-col p-5 bg-white rounded-lg overflow-y-auto">
        {loading || loadingAdd ? (
          <p>Loading...</p>
        ) : (
          <>
            <Calendar
              onChange={onClickDay}
              tileContent={tileContent}
              tileClassName={tileClassName}
              className={`w-full ${eventErrors.length > 0 && "mb-2"}`}
              inputRef={calendarRef}
            />
            <AnimatePresence mode="sync">
              {eventErrors.map((error, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0, y: -10, opacity: 0 }}
                  animate={{ height: 48, y: 0, opacity: 1 }}
                  exit={{ height: 0, y: -10, opacity: 0 }}
                  transition={{ type: "spring", delay: i * 0.2 }}
                >
                  <AlertMessage key={i} message={error} />
                </motion.div>
              ))}
              {Object.keys(errors).map((fieldName, i) => (
                <motion.div
                  key={fieldName}
                  initial={{ height: 0, y: -10, opacity: 0 }}
                  animate={{ height: 48, y: 0, opacity: 1 }}
                  exit={{ height: 0, y: -10, opacity: 0 }}
                  transition={{ type: "spring", delay: i * 0.2 }}
                >
                  <AlertMessage
                    key={fieldName}
                    message={errors[fieldName].message}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            <form onSubmit={onSubmit} className="flex flex-col mt-5 gap-3">
              <input
                type="date"
                {...register("date", {
                  required: "Se requiere seleccionar una fecha",
                })}
                className="hidden"
                hidden
              />
              <div className="relative flex-1">
                <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                  Descripción del evento<span className="text-red-500">*</span>
                </label>
                <textarea
                  maxLength={1000}
                  placeholder="Escriba una descripción del evento"
                  {...register("description", {
                    required: "Se requiere la descripción",
                    maxLength: {
                      value: 1000,
                      message:
                        "La descripción no debe exceder los 1000 caracteres",
                    },
                  })}
                  className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none resize-none"
                  rows={10}
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#a5a5a5 transparent",
                  }}
                />
              </div>
              <section className="w-full flex flex-wrap justify-around">
                {showRegister && (
                  <button
                    type="submit"
                    onClick={(e) => onSubmit("register")}
                    className="py-2 px-8 bg-blue-600 hover:bg-[#18aefa] text-white text-lg rounded-lg"
                  >
                    Guardar
                  </button>
                )}
                {showUpdate && (
                  <button
                    type="submit"
                    onClick={(e) => onSubmit("update")}
                    className="py-2 px-8 bg-blue-600 hover:bg-[#18aefa] text-white text-lg rounded-lg"
                  >
                    Editar
                  </button>
                )}
                {showDelete && (
                  <button
                    type="submit"
                    onClick={(e) => onSubmit("delete")}
                    className="py-2 px-8 bg-red-600 hover:bg-[#18aefa] text-white text-lg rounded-lg"
                  >
                    Eliminar
                  </button>
                )}
              </section>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

export default Events;

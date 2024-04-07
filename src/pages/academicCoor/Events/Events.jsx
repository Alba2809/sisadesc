import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { FaSquarePlus } from "react-icons/fa6";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useEventCalendar } from "../../../hooks/useEventCalendar";
import AlertMessage from "../../../components/AlertMessage";
import Calendar from "react-calendar";
import "@styles/calendar.css";
import { formatDateShort } from "../../../utils/functions";

function Events() {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  const calendarRef = useRef();
  const {
    events,
    eventsSelect,
    getEvents,
    handleAddEvent,
    handleDeleteEvent,
    handleEditEvent,
    handleSelectDay,
    loading,
  } = useEventCalendar({ setValue, getValues });

  useEffect(() => {
    getEvents()
  }, []);

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const formattedDate = date.toISOString().split("T")[0];
      const hasEvents = events?.some(
        (event) => formatDateShort(event.date) === formattedDate
      );
      const totalEvents = events?.filter(
        (event) => formatDateShort(event.date) === formattedDate
      ).length;
      return hasEvents ? (
        <div className="size-4 absolute top-[20%] right-[35%] bg-red-600 rounded-full animate-bounce text-white">
          {totalEvents > 0 && totalEvents}
        </div>
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

  return (
    <div className="w-full h-full flex flex-col">
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">Lista de eventos</h1>
      </header>
      <section
        className="flex-1 flex flex-col p-5 bg-white rounded-lg overflow-y-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#a5a5a5 transparent",
        }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Calendar
              onChange={handleSelectDay}
              tileContent={tileContent}
              tileClassName={tileClassName}
              className={`w-full`}
              inputRef={calendarRef}
            />
            <AnimatePresence mode="sync">
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
            <form className="flex flex-col mt-5 gap-3">
              <input
                type="date"
                {...register("date", {
                  required: "Se requiere seleccionar una fecha",
                })}
                className="hidden"
                hidden
              />
              <div className="flex-1 flex flex-wrap gap-3 items-center">
                <div className="relative max-w-[500px] w-full">
                  <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                    Descripción del evento nuevo
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("newDescription", {
                      required: "Se requiere la descripción",
                    })}
                    className="w-full max-w-[500px] text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none resize-none"
                  />
                </div>
                <div className="relative max-w-[170px] w-full">
                  <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                    Hora de inicio
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    {...register("newStart_time", {
                      required: "Se requiere la hora de inicio",
                    })}
                    className="w-full max-w-[170px] text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none resize-none"
                  />
                </div>
                <div className="relative max-w-[170px] w-full">
                  <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                    Hora de finalización
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    {...register("newEnd_time", {
                      required: "Se requiere la hora de finalización",
                    })}
                    className="w-full max-w-[170px] text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none resize-none"
                  />
                </div>
                <button type="button" onClick={handleAddEvent}>
                  <FaSquarePlus size="2em" color="green" />
                </button>
              </div>
              <section className="w-full flex flex-col justify-around drop-shadow-md rounded-md p-y-3 gap-y-4 mt-4">
                <AnimatePresence mode="layaout">
                  {eventsSelect?.map((event) => (
                    <motion.div
                      layout
                      key={event.id}
                      className="w-full flex flex-row gap-3"
                      initial={{ height: 0, y: -10, opacity: 0 }}
                      animate={{ height: 48, y: 0, opacity: 1 }}
                      exit={{ height: 0, y: -10, opacity: 0 }}
                    >
                      <input
                        type="text"
                        {...register("description" + event.id, {
                          required: "Se requiere la descripción",
                        })}
                        className="w-full max-w-[500px] text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none resize-none"
                        defaultValue={event.description}
                      />
                      <input
                        type="time"
                        {...register("start_time" + event.id, {
                          required: "Se requiere la hora de inicio",
                        })}
                        className="w-[200px] text-black px-4 py-3 rounded-md border border-gray
                    -300 focus:border-blue-400 focus:border focus:outline-none resize-none"
                        defaultValue={event.start_time}
                      />
                      <input
                        type="time"
                        {...register("end_time" + event.id, {
                          required: "Se requiere la hora de finalización",
                        })}
                        className="w-[200px] text-black px-4 py-3 rounded-md border border-gray
                    -300 focus:border-blue-400 focus:border focus:outline-none resize-none"
                        defaultValue={event.end_time}
                      />
                      <div className="flex flex-row gap-5">
                        <button
                          type="button"
                          onClick={() => handleEditEvent(event.id)}
                        >
                          <FiEdit2 size="1.5em" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <RiDeleteBin6Line size="1.5em" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </section>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

export default Events;

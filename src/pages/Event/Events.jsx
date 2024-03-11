import { useEvent } from "@context/EventContext";
import { useEffect, useLayoutEffect, useState } from "react";
import { formatDateShort } from "@constants/functions";
import { AnimatePresence, motion } from "framer-motion";
import Calendar from "react-calendar";
import "@styles/calendar.css";

function Events() {
  const { getEvents, events, loading } = useEvent();
  const [eventsSelect, setEventsSelect] = useState([]);

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

  const onClickDay = (date) => {
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
  };

  useEffect(() => {
    getEvents("events");
  }, []);

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
              onChange={onClickDay}
              tileContent={tileContent}
              tileClassName={tileClassName}
              className={`w-full`}
            />
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
                      className="w-full max-w-[500px] text-black px-4 py-3 rounded-md border border-gray-300 resize-none bg-white focus:border-blue-400 focus:border focus:outline-none"
                      defaultValue={event.description}
                      readOnly
                    />
                    <input
                      type="time"
                      className="w-[150px] text-black px-4 py-3 rounded-md border border-gray
                    -300 text-center bg-white"
                      defaultValue={event.start_time}
                      disabled
                    />
                    <input
                      type="time"
                      className="w-[150px] text-black px-4 py-3 rounded-md border border-gray
                    -300 text-center bg-white"
                      defaultValue={event.end_time}
                      disabled
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </section>
          </>
        )}
      </section>
    </div>
  );
}

export default Events;

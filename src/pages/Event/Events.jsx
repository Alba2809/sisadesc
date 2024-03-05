import { useEvent } from "@context/EventContext";
import { useEffect, useState } from "react";
import { formatDateShort } from "@constants/functions";
import Calendar from "react-calendar";
import "@styles/calendar.css";

function Events() {
  const { getEvents, events, loading, eventUpdated, setEventUpdated } = useEvent();
  const [eventSelect, setEventSelect] = useState(null);

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
    } else {
      setEventSelect(null);
    }
  };

  useEffect(() => {
    getEvents("events");
  }, []);

  useEffect(() => {
    /* validate that an event was updated, and if the eventSelected.id is equal to eventUpdated.id then change eventSelected to eventUpdated */
    if (eventUpdated) {
      if (eventSelect?.id === eventUpdated.id) {
        setEventSelect(eventUpdated);
      }
      setEventUpdated(null);
    }
  }, [eventUpdated])

  return (
    <div className="w-full h-full flex flex-col">
      <header className="h-[50px]">
        <h1 className="font-medium font-serif text-2xl">Lista de eventos</h1>
      </header>
      <section className="flex-1 flex flex-col p-5 bg-white rounded-lg overflow-y-auto">
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
            <div className="relative flex-1 mt-5">
              <label className="absolute -top-3 left-5 text-sm text-center bg-white text-gray-500 z-10">
                Descripción del evento<span className="text-red-500">*</span>
              </label>
              <textarea
                maxLength={1000}
                placeholder="Escriba una descripción del evento"
                defaultValue={eventSelect?.description ?? ""}
                className="w-full text-black px-4 py-3 rounded-md border border-gray-300 focus:border-blue-400 focus:border focus:outline-none resize-none"
                rows={10}
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#a5a5a5 transparent",
                }}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Events;

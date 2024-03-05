import axios from "./axios";

export const getEventsRequest = () => axios.get("/event/getevents");

export const getEventByIdRequest = (id) => axios.get(`/event/geteventid/${id}`);

export const getEventByDateRequest = (date) => axios.get(`/event/geteventdate/${date}`);

export const registerEventRequest = (data) => axios.post("/event/registerevent", data);

export const updateEventRequest = (id, data) => axios.put(`/event/updateevent/${id}`, data);

export const deleteEventRequest = (id) => axios.delete(`/event/deleteevent/${id}`);
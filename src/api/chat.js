import axios from "./axios";

export const getUsersToChatRequest = () => axios.get("/chat/getusers");

export const sendMessageRequest = (data, reciever_id) =>
  axios.post(`/chat/sendmessage/${reciever_id}`, data);

export const getMessagesRequest = (userToChat) =>
  axios.get(`/chat/getmessages/${userToChat}`);

export const getFileOfMessageRequest = (messageId) => axios.get(`/chat/getFile/${messageId}`);
import axios from "./axios";

export const loginRequest = (user) => axios.post("/login", user);

export const verifyTokenRequest = (cookie) => axios.post(`/verify/${cookie}`);

export const getUserRequest = () => axios.get("/user");

export const updatePasswordRequest = (data) => axios.post("/updatepassword", data);
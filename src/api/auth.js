import axios from "./axios";

export const loginRequest = (user) => axios.post("/login", user);

export const verifyTokenRequest = () => axios.get("/verify");

export const getUserRequest = () => axios.get("/user");

export const updatePasswordRequest = (data) => axios.post("/updatepassword", data);
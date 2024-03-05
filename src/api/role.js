import axios from "./axios";

export const getRolesRequest = () => axios.get("/role/getroles");

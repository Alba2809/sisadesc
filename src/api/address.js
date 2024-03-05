import axios from "./axios";

export const getAddressesRequest = () => axios.get("/admin/getaddresses");
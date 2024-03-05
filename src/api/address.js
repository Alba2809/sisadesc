import axios from "./axios";

export const getAddressesRequest = () => axios.get("/address/getaddresses");
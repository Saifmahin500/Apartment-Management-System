import API from "../services/api";


export const getSettings = () => API.get("/settings");


export const updateSettings = (data) => API.post("/settings/update", data);


import API from "../services/api";


export const getProfile = () => API.get("/profile");


export const updateProfile = (formData) =>
  API.post("/profile/update", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });


export const changePassword = (data) =>
  API.post("/profile/change-password", data);

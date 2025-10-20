import axiosClient from "./axiosClient";


export const getPublicServices = () => axiosClient.get("/public/services");


export const createServiceRequest = (payload) =>
  axiosClient.post("/service-requests", payload);


export const getMyRequests = () => axiosClient.get("/service-requests");


export const getAllRequests = () => axiosClient.get("/service-requests");


export const updateRequestStatus = (id, payload) =>
  axiosClient.put(`/service-requests/${id}/status`, payload);

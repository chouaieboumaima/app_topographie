import api from "./api";

export const getUsers = () => {
 return api.get("/api/admin/users");
};

export const activateUser = (id) => {
 return api.put(`/api/admin/users/${id}/activate`);
};

export const deactivateUser = (id) => {
 return api.put(`/api/admin/users/${id}/deactivate`);
};

export const deleteUser = (id) => {
 return api.delete(`/api/admin/users/${id}`);
};

export const getAdminStats = () => {
 return api.get("/api/admin/stats");
};
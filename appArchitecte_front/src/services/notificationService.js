import api from "./api";

const notificationService = {

  getNotifications: async () => {
    const res = await api.get("/api/notifications");
    return res.data;
  },

  saveToken: async (token) => {
    const res = await api.post("/api/notifications/save-token", {
      token
    });
    return res.data;
  }

};

export default notificationService;
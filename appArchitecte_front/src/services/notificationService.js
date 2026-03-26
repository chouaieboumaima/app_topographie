import api from "./api";

// notificationService.js
const notificationService = {
  // ✅ Enregistre le token Expo auprès du backend
  saveToken: async (token) => {
    try {
      // ⚠️ Endpoint corrigé : /api/save-token
      const res = await api.post("/api/save-token", { token });
      return res.data;
    } catch (err) {
      console.log("Erreur save token:", err.response?.data || err.message);
      throw err;
    }
  },

  // ✅ Récupère les notifications pour l'utilisateur connecté
  getNotifications: async () => {
    try {
      const res = await api.get("/api/notifications");
      return res.data;
    } catch (err) {
      console.log("Erreur get notifications:", err.response?.data || err.message);
      return [];
    }
  },
};

export default notificationService;
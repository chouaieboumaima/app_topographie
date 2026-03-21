// src/services/profileService.js
import api from "./api";

const profileService = {
  getProfile: async () => {
    try {
      const res = await api.get("/api/auth/me"); // ← ajouter /api
      return res.data;
    } catch (err) {
      console.log("Erreur fetchProfile:", err.response ? err.response.data : err);
      throw err;
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await api.put("/api/auth/me", data); // ← ajouter /api
      return res.data;
    } catch (err) {
      console.log("Erreur updateProfile:", err.response ? err.response.data : err);
      throw err;
    }
  }
};

export default profileService;
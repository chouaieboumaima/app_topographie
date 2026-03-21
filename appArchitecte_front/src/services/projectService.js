// services/projectService.js
import api from "./api";

const projectService = {
  getProjects: async () => {
    try {
      const res = await api.get("/api/projects");
      if (!Array.isArray(res.data)) return [];
      return res.data;
    } catch (err) {
      console.log("Erreur fetchProjects:", err.response ? err.response.data : err);
      throw err;
    }
  },

  createProject: async (data) => {
    try {
      const res = await api.post("/api/projects", data);
      return res.data;
    } catch (err) {
      console.log("Erreur createProject:", err.response ? err.response.data : err);
      throw err;
    }
  },

  updateProject: async (id, data) => {
    if (!id) throw new Error("updateProject: id du projet non défini");
    try {
      const res = await api.put(`/api/projects/${id}`, data);
      return res.data;
    } catch (err) {
      console.log("Erreur updateProject:", err.response ? err.response.data : err);
      throw err;
    }
  },

  deleteProject: async (id) => {
    if (!id) throw new Error("deleteProject: id du projet non défini");
    try {
      const res = await api.delete(`/api/projects/${id}`);
      return res.data;
    } catch (err) {
      console.log("Erreur deleteProject:", err.response ? err.response.data : err);
      throw err;
    }
  },
};

export default projectService;
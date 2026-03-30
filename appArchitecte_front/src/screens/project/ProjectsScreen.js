// src/screens/project/ProjectsScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import projectService from "../../services/projectService";
import { useIsFocused } from "@react-navigation/native";

export default function ProjectsScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddProject, setShowAddProject] = useState(false);
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null); // null = création, sinon modification

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("En cours");

  const isFocused = useIsFocused();

  // Charger les projets depuis l'API
  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects();
      const sorted = data
        .map(p => ({
          id: p.id,
          name: p.name,
          description: p.description || "",
          status: p.status,
          files: p.files || [],
        }))
        .sort((a, b) => b.id - a.id);
      setProjects(sorted);
    } catch (err) {
      console.log("Erreur fetchProjects:", err);
      Alert.alert("Erreur", "Impossible de charger les projets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) loadProjects();
  }, [isFocused]);

  // Créer ou mettre à jour projet via API
  const saveProject = async () => {
    if (!name.trim()) {
      Alert.alert("Erreur", "Le nom du projet est obligatoire !");
      return;
    }

    try {
      if (editingProject) {
        // UPDATE
        await projectService.updateProject(editingProject.id, { name, description, status });
        setProjects(prev =>
          prev.map(p => (p.id === editingProject.id ? { ...p, name, description, status } : p))
        );
        Alert.alert("Succès", "Projet mis à jour !");
      } else {
        // CREATE
        const data = await projectService.createProject({ name, description, status });
        setProjects(prev => [{ ...data, files: data.files || [] }, ...prev]);
        Alert.alert("Succès", "Projet ajouté !");
      }

      // Réinitialiser formulaire
      setName(""); setDescription(""); setStatus("En cours");
      setEditingProject(null);
      setShowAddProject(false);

    } catch (err) {
      console.log("Erreur saveProject:", err);
      Alert.alert("Erreur", err.response?.data?.error || "Impossible de sauvegarder le projet");
    }
  };

  // Supprimer projet via l'API
  const deleteProject = async (id) => {
    Alert.alert(
      "Supprimer projet",
      "Êtes-vous sûr de vouloir supprimer ce projet ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await projectService.deleteProject(id);
              setProjects(prev => prev.filter(p => p.id !== id));
              setShowProjectDetail(false);
            } catch (err) {
              console.log("Erreur deleteProject:", err);
              Alert.alert("Erreur", "Impossible de supprimer le projet");
            }
          },
        },
      ]
    );
  };

  // Rendu projet
  const renderProject = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => { setSelectedProject(item); setShowProjectDetail(true); }}
    >
      <View style={styles.iconBox}>
        <MaterialIcons name="apartment" size={26} color="#2F4858" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.projectName}>{item.name}</Text>
        <Text style={styles.subtitle}>{item.status || "Projet architectural"}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={26} color="#9CA3AF" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
        <ActivityIndicator size="large" color="#2F4858" />
        <Text>Chargement des projets...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Mes Projets</Text>
          <Text style={styles.counter}>{projects.length} projets actifs</Text>
        </View>
      </View>

      {/* LISTE PROJETS */}
      <FlatList
        data={projects}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={renderProject}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* MODAL AJOUT / MODIF */}
      <Modal visible={showAddProject} animationType="slide" transparent={true} onRequestClose={() => setShowAddProject(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
              <Text style={styles.addTitle}>{editingProject ? "Modifier le projet" : "Créer un nouveau projet"}</Text>

              <Text style={styles.label}>Nom du projet</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Villa Moderne"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#B0B0B0"
              />

              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, { height: 100, textAlignVertical: "top" }]}
                placeholder="Description du projet"
                value={description}
                onChangeText={setDescription}
                multiline
                placeholderTextColor="#B0B0B0"
              />

              <Text style={styles.label}>Statut</Text>
              <View style={styles.statusContainer}>
                {["En cours","Terminé","En attente"].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.statusButton, status===s && styles.statusSelected]}
                    onPress={()=>setStatus(s)}
                  >
                    <Text style={[styles.statusText, status===s && {color:"#fff"}]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={saveProject}>
                <Text style={styles.saveText}>{editingProject ? "Mettre à jour" : "Enregistrer le projet"}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeButton} onPress={() => { setShowAddProject(false); setEditingProject(null); }}>
                <MaterialIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MODAL DETAIL PROJET */}
      <Modal visible={showProjectDetail} animationType="fade" transparent={true} onRequestClose={() => setShowProjectDetail(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedProject && (
              <View>
                <Text style={styles.addTitle}>{selectedProject.name}</Text>
                <Text style={[styles.label,{marginBottom:20}]}>{selectedProject.description || "Pas de description"}</Text>

                {/* BOUTON VOIR FICHIERS */}
                <TouchableOpacity
                  style={styles.detailButton}
                  onPress={() => {
                    setShowProjectDetail(false);
                    navigation.navigate("Clouds", {
                      files: selectedProject.files,
                      projectName: selectedProject.name
                    });
                  }}
                >
                  <Text style={styles.detailText}>Consulter mes nuages</Text>
                </TouchableOpacity>

                {/* MODIFIER */}
                <TouchableOpacity
                  style={[styles.detailButton, { backgroundColor: "#7a5716" }]}
                  onPress={() => {
                    setEditingProject(selectedProject);
                    setName(selectedProject.name);
                    setDescription(selectedProject.description);
                    setStatus(selectedProject.status);
                    setShowProjectDetail(false);
                    setShowAddProject(true);
                  }}
                >
                  <Text style={styles.detailText}>Modifier</Text>
                </TouchableOpacity>

                {/* SUPPRIMER */}
                <TouchableOpacity
                  style={[styles.detailButton, { backgroundColor: "#8f4c4c" }]}
                  onPress={()=>deleteProject(selectedProject.id)}
                >
                  <Text style={styles.detailText}>Supprimer</Text>
                </TouchableOpacity>

                {/* FERMER */}
                <TouchableOpacity style={[styles.detailButton, { backgroundColor: "#8A97A6" }]} onPress={()=>setShowProjectDetail(false)}>
                  <Text style={styles.detailText}>Fermer</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* BOUTON AJOUTER */}
      <TouchableOpacity style={styles.fab} onPress={()=>{ setEditingProject(null); setShowAddProject(true); }}>
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, backgroundColor:"#F6F8FB", paddingHorizontal:20},
  header:{flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginTop:30, marginBottom:30},
  title:{fontSize:28, fontWeight:"700", color:"#2F4858"},
  counter:{marginTop:4, fontSize:14, color:"#8A97A6"},
  card:{flexDirection:"row", alignItems:"center", backgroundColor:"#FFFFFF", padding:18, borderRadius:18, marginBottom:16, borderLeftWidth:4, borderLeftColor:"#2F4858", shadowColor:"#000", shadowOpacity:0.07, shadowRadius:12, shadowOffset:{width:0,height:6}, elevation:5},
  iconBox:{backgroundColor:"#EEF2F7", padding:12, borderRadius:14, marginRight:15},
  textContainer:{flex:1},
  projectName:{fontSize:17, fontWeight:"600", color:"#2F4858"},
  subtitle:{fontSize:13,color:"#8A97A6", marginTop:3},
  fab:{position:"absolute", bottom:30, right:25, backgroundColor:"#2F4858", padding:18, borderRadius:30, shadowColor:"#000", shadowOpacity:0.25, shadowRadius:10, shadowOffset:{width:0,height:5}, elevation:8},
  modalOverlay:{flex:1, backgroundColor:"rgba(0,0,0,0.4)", justifyContent:"center", alignItems:"center", paddingHorizontal:15},
  modalContainer:{width:"100%", backgroundColor:"#fff", borderRadius:22, padding:20, shadowColor:"#000", shadowOpacity:0.25, shadowRadius:15, shadowOffset:{width:0,height:6}, elevation:10},
  addTitle:{fontSize:20, fontWeight:"700", color:"#2F4858", marginBottom:20, textAlign:"center"},
  input:{  color:"#000",backgroundColor:"#ffff", borderRadius:14, padding:14, fontSize:16, borderWidth:1, borderColor:"#E5E7EB", marginBottom:15, shadowColor:"#000", shadowOpacity:0.05, shadowRadius:6, shadowOffset:{width:0,height:3}, elevation:3},
  label:{fontSize:14, fontWeight:"600", color:"#6B7A8F", marginBottom:6},
  statusContainer:{flexDirection:"row", marginBottom:15},
  statusButton:{paddingVertical:10, paddingHorizontal:16, borderRadius:18, backgroundColor:"#E5E7EB", marginRight:12},
  statusSelected:{backgroundColor:"#2F4858"},
  statusText:{fontSize:14, fontWeight:"600", color:"#2F4858"},
  saveButton:{backgroundColor:"#2F4858", paddingVertical:16, borderRadius:22, alignItems:"center", shadowColor:"#000", shadowOpacity:0.25, shadowRadius:10, shadowOffset:{width:0,height:6}, elevation:8, marginBottom:10},
  saveText:{fontSize:16, fontWeight:"700", color:"#fff"},
  closeButton:{position:"absolute", top:0,right:0, backgroundColor:"#FF4D4D", padding:5,borderRadius:20,elevation:6},
  detailButton:{backgroundColor:"#2F4858", paddingVertical:14, borderRadius:20, alignItems:"center", marginBottom:12},
  detailText:{color:"#fff", fontWeight:"700", fontSize:16},
});
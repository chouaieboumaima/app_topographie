// src/screens/home/HomeScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import projectService from "../services/projectService";
import { useIsFocused } from "@react-navigation/native";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    projets: 0,
    nuages: 35,      // valeur fixe si tu veux
    nettoyes: 20,    // valeur fixe si tu veux
    enCours: 0,
    termines: 0,
    enAttente: 0,
  });

  const isFocused = useIsFocused(); // recharge à chaque focus de l'écran

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await projectService.getProjects();

        const statusCounts = {
          "En cours": 0,
          Terminé: 0,
          "En attente": 0,
        };

        data.forEach((p) => {
          if (statusCounts[p.status] !== undefined) {
            statusCounts[p.status] += 1;
          }
        });

        setStats({
          projets: data.length,
          nuages: 35,
          nettoyes: 20,
          enCours: statusCounts["En cours"] || 0,
          termines: statusCounts["Terminé"] || 0,
          enAttente: statusCounts["En attente"] || 0,
        });
      } catch (err) {
        console.log("Erreur fetchProjects:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) fetchProjects();
  }, [isFocused]);

  const statItems = [
    { title: "Projets", value: stats.projets, icon: "folder" },
    { title: "Nuages", value: stats.nuages, icon: "cloud" },
    { title: "Nettoyés", value: stats.nettoyes, icon: "check-circle" },
    { title: "En cours", value: stats.enCours, icon: "autorenew" },
    { title: "Terminés", value: stats.termines, icon: "check-circle" },
    { title: "En attente", value: stats.enAttente, icon: "hourglass-empty" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}000000000000000000000000
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Bienvenue Architecte</Text>
          <Text style={styles.subtitle}>
            Gérez vos projets 3D et nuages de points
          </Text>
        </View>

        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={styles.avatar}
        />
      </View>

      {/* STATS */}
      {loading ? (
        <ActivityIndicator size="large" color="#2F4858" style={{ flex: 1 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.centerContainer}>
          <View style={styles.statsContainer}>
            {statItems.map((item, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name={item.icon} size={28} color="#2F4858" />
                </View>
                <Text style={styles.value}>{item.value}</Text>
                <Text style={styles.label}>{item.title}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2F4858",
  },
  subtitle: {
    color: "#7B8A8B",
    marginTop: 6,
    fontSize: 14,
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#E5E7EB",
  },
  centerContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 25,
    alignItems: "center",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: "#EEF2F7",
    padding: 12,
    borderRadius: 12,
  },
  value: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 10,
    color: "#2F4858",
  },
  label: {
    color: "#6B7A8F",
    marginTop: 4,
    fontSize: 14,
  },
});
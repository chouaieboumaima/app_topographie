import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  const stats = [
    { title: "Projects", value: 12, icon: "folder" },
    { title: "Clouds", value: 35, icon: "cloud" },
    { title: "Cleaned", value: 20, icon: "check-circle" },
    { title: "Processing", value: 3, icon: "autorenew" },
  ];

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
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

      {/* CENTER */}
      <View style={styles.centerContainer}>
        <View style={styles.statsContainer}>
          {stats.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.iconContainer}>
                <MaterialIcons name={item.icon} size={28} color="#2F4858" />
              </View>
              <Text style={styles.value}>{item.value}</Text>
              <Text style={styles.label}>{item.title}</Text>
            </View>
          ))}
        </View>
      </View>

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
    flex: 1,
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
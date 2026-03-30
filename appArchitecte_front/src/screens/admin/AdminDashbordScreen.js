import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Animated, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getAdminStats } from "../../services/adminService";
import UsersScreen from "./UsersScreen";
import StatisticsScreen from "./StatisticsScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, CommonActions } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;

export default function AdminDashboard() {
  const navigation = useNavigation();
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    inactive_users: 0,
    total_projects: 0
  });

  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const underlineAnim = new Animated.Value(0);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    Animated.spring(underlineAnim, {
      toValue: selectedTab === "dashboard" ? 0 : selectedTab === "statistics" ? 1 : 2,
      useNativeDriver: false,
    }).start();
  }, [selectedTab]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await getAdminStats();
      setStats(res.data);
    } catch (error) {
      console.log("Erreur stats admin:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("access_token");
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1f1f1f" />
        <Text style={styles.loadingText}>Chargement des données...</Text>
      </View>
    );
  }

  const renderDashboard = () => (
    <View style={styles.kpiContainer}>
      <View style={styles.kpiBox}>
        <View style={styles.quickCard}>
          <MaterialCommunityIcons name="account-group-outline" size={36} color="#1f1f1f" />
          <Text style={styles.quickCardLabel}>Total Users</Text>
          <Text style={styles.quickCardNumber}>{stats.total_users}</Text>
        </View>
        <View style={[styles.quickCard, { backgroundColor: "#A6937D" }]}>
          <MaterialCommunityIcons name="check-circle-outline" size={36} color="#fff" />
          <Text style={[styles.quickCardLabel, { color: "#fff" }]}>Active Users</Text>
          <Text style={[styles.quickCardNumber, { color: "#fff" }]}>{stats.active_users}</Text>
        </View>
        <View style={[styles.quickCard, { backgroundColor: "#C45E44" }]}>
          <MaterialCommunityIcons name="close-circle-outline" size={36} color="#fff" />
          <Text style={[styles.quickCardLabel, { color: "#fff" }]}>Inactive Users</Text>
          <Text style={[styles.quickCardNumber, { color: "#fff" }]}>{stats.inactive_users}</Text>
        </View>
        <View style={[styles.quickCard, { backgroundColor: "#7D7D7D" }]}>
          <MaterialCommunityIcons name="folder-outline" size={36} color="#fff" />
          <Text style={[styles.quickCardLabel, { color: "#fff" }]}>Projects</Text>
          <Text style={[styles.quickCardNumber, { color: "#fff" }]}>{stats.total_projects}</Text>
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case "dashboard":
        return <ScrollView style={{ flex: 1 }}>{renderDashboard()}</ScrollView>;
      case "statistics":
        return <ScrollView style={{ flex: 1 }}><StatisticsScreen stats={stats} /></ScrollView>;
      case "users":
        return <UsersScreen onUserChange={loadStats} />;
      default:
        return null;
    }
  };

  const tabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "statistics", label: "Statistiques" },
    { key: "users", label: "Utilisateurs" }
  ];

  const underlineTranslate = underlineAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, screenWidth / 3, (screenWidth / 3) * 2],
  });

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <MaterialCommunityIcons name="account-circle" size={50} color="#1f1f1f" style={styles.avatar} />
        </View>

        {/* BOUTON DECONNEXION CENTRÉ AVEC ICONE */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialCommunityIcons name="logout" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TAB BAR */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.key} style={styles.tabButton} onPress={() => setSelectedTab(tab.key)}>
            <Text style={[styles.tabLabel, selectedTab === tab.key && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
        <Animated.View style={[styles.tabUnderline, { transform: [{ translateX: underlineTranslate }] }]} />
      </View>

      {/* CONTENT */}
      <View style={{ flex: 1 }}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2", paddingHorizontal: 20, paddingTop: 40 },
  
  header: { marginBottom: 25 },
  titleContainer: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  title: { fontSize: 26, fontWeight: "900", color: "#1f1f1f", letterSpacing: 1, flex: 1 },
  avatar: { marginLeft: 12 },

  logoutContainer: { alignItems: "center", marginTop: 12 },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C45E44",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  logoutText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  tabBar: { flexDirection: "row", position: "relative", marginBottom: 25, backgroundColor: "#fff", borderRadius: 14, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  tabButton: { flex: 1, paddingVertical: 14, alignItems: "center" },
  tabLabel: { fontSize: 15, fontWeight: "500", color: "#9ca3af" },
  tabLabelActive: { color: "#1f1f1f", fontWeight: "700" },
  tabUnderline: { position: "absolute", bottom: 0, width: screenWidth / 3, height: 3, backgroundColor: "rgba(31,31,31,0.9)", borderRadius: 2 },

  kpiContainer: { flex: 1, alignItems: "center" },
  kpiBox: { width: "100%", backgroundColor: "#fff", borderRadius: 28, padding: 20, paddingBottom: 25, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 6, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  quickCard: { width: "48%", borderRadius: 20, paddingVertical: 35, alignItems: "center", marginBottom: 18, justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, backgroundColor: "#D9CAB3" },
  quickCardLabel: { fontSize: 15, marginTop: 12, fontWeight: "600", color: "#1f1f1f" },
  quickCardNumber: { fontSize: 38, fontWeight: "900", marginTop: 8 },

  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 16, color: "#374151" },
});
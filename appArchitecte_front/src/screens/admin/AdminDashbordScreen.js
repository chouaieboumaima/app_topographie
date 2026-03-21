import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Animated, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getAdminStats } from "../../services/adminService";
import UsersScreen from "./UsersScreen";
import StatisticsScreen from "./StatisticsScreen";

const screenWidth = Dimensions.get("window").width;

export default function AdminDashboard() {
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1f1f1f" />
        <Text style={styles.loadingText}>Chargement des données...</Text>
      </View>
    );
  }

  const kpiData = [
    { label: "Total Users", value: stats.total_users, icon: "account-group-outline", color: "#D9CAB3", textColor: "#1f1f1f" },
    { label: "Active Users", value: stats.active_users, icon: "check-circle-outline", color: "#A6937D", textColor: "#fff" },
    { label: "Inactive Users", value: stats.inactive_users, icon: "close-circle-outline", color: "#C45E44", textColor: "#fff" },
    { label: "Projects", value: stats.total_projects, icon: "folder-outline", color: "#7D7D7D", textColor: "#fff" },
  ];

  const renderDashboard = () => (
    <View style={styles.kpiContainer}>
      <View style={styles.kpiBox}>
        {kpiData.map((kpi, index) => (
          <View key={index} style={[styles.quickCard, { backgroundColor: kpi.color }]}>
            <MaterialCommunityIcons name={kpi.icon} size={36} color={kpi.textColor} />
            <Text style={[styles.quickCardLabel, { color: kpi.textColor }]}>{kpi.label}</Text>
            <Text style={[styles.quickCardNumber, { color: kpi.textColor }]}>{kpi.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case "dashboard":
        return <ScrollView style={{ flex: 1, paddingBottom: 30 }}>{renderDashboard()}</ScrollView>;
      case "statistics":
        return <ScrollView style={{ flex: 1, paddingBottom: 30 }}><StatisticsScreen stats={stats} /></ScrollView>;
      case "users":
        return <UsersScreen />;
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
        <Text style={styles.title}>Admin Dashboard</Text>
        <MaterialCommunityIcons name="account-circle" size={50} color="#1f1f1f" />
      </View>

      {/* TAB BAR */}
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.key} style={styles.tabButton} onPress={() => setSelectedTab(tab.key)}>
            <Text style={[styles.tabLabel, selectedTab === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
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
  container: { 
    flex: 1, 
    backgroundColor: "#f2f2f2", 
    paddingHorizontal: 20, 
    paddingTop: 40 
  },
  
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 25 
  },
  
  title: { 
    fontSize: 26, 
    fontWeight: "900", 
    color: "#1f1f1f", 
    letterSpacing: 1 
  },
  
  loadingContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  
  loadingText: { 
    marginTop: 12, 
    fontSize: 16, 
    color: "#374151" 
  },
  
  tabBar: { 
    flexDirection: "row", 
    position: "relative", 
    marginBottom: 25, 
    backgroundColor: "#fff", 
    borderRadius: 14, 
    shadowColor: "#000", 
    shadowOpacity: 0.08, 
    shadowRadius: 12, 
    shadowOffset: { width: 0, height: 4 }, 
    elevation: 4 
  },
  
  tabButton: { 
    flex: 1, 
    paddingVertical: 14, 
    alignItems: "center" 
  },
  
  tabLabel: { 
    fontSize: 15, 
    fontWeight: "500", 
    color: "#9ca3af" 
  },
  
  tabLabelActive: { 
    color: "#1f1f1f", 
    fontWeight: "700" 
  },
  
  tabUnderline: { 
    position: "absolute", 
    bottom: 0, 
    width: screenWidth / 3, 
    height: 3, 
    backgroundColor: "rgba(31,31,31,0.9)", 
    borderRadius: 2 
  },
  
  // Container KPI avec cadre
  kpiContainer: { 
    flex: 1, 
    alignItems: "center" 
  },
  
  kpiBox: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 20,
    paddingBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  
  quickCard: {
    width: "48%",
    borderRadius: 20,
    paddingVertical: 35,
    alignItems: "center",
    marginBottom: 18,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  
  quickCardLabel: { 
    fontSize: 15, 
    marginTop: 12, 
    fontWeight: "600" 
  },
  
  quickCardNumber: { 
    fontSize: 38, 
    fontWeight: "900", 
    marginTop: 8 
  },
});
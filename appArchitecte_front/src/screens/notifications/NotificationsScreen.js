import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function NotificationsScreen() {

  const [notifications] = useState([
    {
      id: "1",
      title: "File cleaned successfully",
      message: "scan_01.las has been cleaned",
      time: "2 minutes ago",
      icon: "check-circle",
      color: "#4CAF50"
    },
    {
      id: "2",
      title: "Processing started",
      message: "scan_02.las is processing",
      time: "10 minutes ago",
      icon: "autorenew",
      color: "#2196F3"
    },
    {
      id: "3",
      title: "Processing error",
      message: "scan_03.las failed to process",
      time: "1 hour ago",
      icon: "error",
      color: "#F44336"
    }
  ]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <MaterialIcons name={item.icon} size={28} color={item.color} />

      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    padding: 20
  },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20
  },

  card: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    elevation: 3
  },

  textContainer: {
    marginLeft: 12,
    flex: 1
  },

  title: {
    fontSize: 16,
    fontWeight: "600"
  },

  message: {
    fontSize: 14,
    color: "gray"
  },

  time: {
    fontSize: 12,
    color: "#999",
    marginTop: 4
  }

});
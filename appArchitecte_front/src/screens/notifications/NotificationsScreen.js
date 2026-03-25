import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import notificationService from "../../services/notificationService";

export default function NotificationsScreen() {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Calcul du nombre de notifications non lues
  const unreadCount = notifications.filter(n => n.is_read === false).length;

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <MaterialIcons
        name={item.is_read ? "check-circle" : "notifications"}
        size={28}
        color={item.is_read ? "#4CAF50" : "#2196F3"}
      />

      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Notifications ({unreadCount})
      </Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    alignItems: "center",
  },
  textContainer: {
    marginLeft: 10,
  },
  title: {
    fontWeight: "bold",
  },
  message: {
    color: "#555",
  },
});
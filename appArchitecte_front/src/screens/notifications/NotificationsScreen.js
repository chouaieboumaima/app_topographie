import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import notificationService from "../../services/notificationService";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await notificationService.getNotifications();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log("Erreur notifications:", err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    loadNotifications();
  }, []);

  const toggleRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, is_read: !n.is_read } : n
      )
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: item.is_read ? "#F0F0F0" : "#E3F2FD" },
      ]}
      onPress={() => toggleRead(item.id)}
      activeOpacity={0.8}
    >
      <MaterialIcons
        name={item.is_read ? "check-circle" : "notifications-active"}
        size={28}
        color={item.is_read ? "#4CAF50" : "#2196F3"}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      {!item.is_read && <View style={styles.unreadBadge} />}
    </TouchableOpacity>
  );

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Notifications <Text style={styles.unreadCount}>({unreadCount})</Text>
      </Text>

      {notifications.length === 0 ? (
        <Text style={styles.empty}>Aucune notification</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#FAFAFA" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  unreadCount: { color: "#2196F3" },
  empty: { textAlign: "center", marginTop: 30, color: "#888", fontSize: 16 },
  card: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  textContainer: { marginLeft: 12, flex: 1 },
  title: { fontWeight: "bold", fontSize: 16, color: "#333" },
  message: { color: "#555", marginTop: 4, fontSize: 14 },
  time: { fontSize: 12, color: "#999", marginTop: 6 },
  unreadBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2196F3",
    marginLeft: 8,
  },
});
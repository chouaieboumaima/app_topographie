import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { Card, Text, IconButton } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getUsers, activateUser, deactivateUser, deleteUser } from "../../services/adminService";

export default function UsersScreen() {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleActivate = async (id) => { await activateUser(id); loadUsers(); };
  const handleDeactivate = async (id) => { await deactivateUser(id); loadUsers(); };
  const handleDelete = (id) => {
    Alert.alert("Supprimer utilisateur", "Confirmer suppression ?", [
      { text: "Annuler" },
      { text: "Supprimer", onPress: async () => { await deleteUser(id); loadUsers(); } }
    ]);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={[styles.status, { backgroundColor: item.is_active ? "#22c55e" : "#C45E44" }]}>
          {item.is_active ? "Actif" : "Désactivé"}
        </Text>

        {/* Boutons avec icônes */}
        <View style={styles.buttons}>
          <IconButton
            icon={() => <MaterialCommunityIcons name="check-circle-outline" size={26} color="#fff" />}
            style={[styles.activateButton]}
            onPress={() => handleActivate(item.id)}
          />
          <IconButton
            icon={() => <MaterialCommunityIcons name="close-circle-outline" size={26} color="#fff" />}
            style={[styles.deactivateButton]}
            onPress={() => handleDeactivate(item.id)}
          />
          <IconButton
            icon={() => <MaterialCommunityIcons name="delete-outline" size={26} color="#fff" />}
            style={[styles.deleteButton]}
            onPress={() => handleDelete(item.id)}
          />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion utilisateurs</Text>
      <FlatList 
        data={users} 
        keyExtractor={item => item.id.toString()} 
        renderItem={renderItem} 
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f2f2f2", 
    paddingHorizontal: 15, 
    paddingTop: 20 
  },
  
  title: { 
    fontSize: 26, 
    fontWeight: "900", 
    marginBottom: 20, 
    color: "#1f1f1f" 
  },

  card: { 
    marginBottom: 18, 
    borderRadius: 18, 
    backgroundColor: "#ffffff", 
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },

  name: { 
    fontSize: 18, 
    fontWeight: "700", 
    marginBottom: 4, 
    color: "#111827" 
  },

  email: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8
  },

  status: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 12
  },

  buttons: { 
    flexDirection: "row", 
    justifyContent: "flex-start",
    marginTop: 10,
  },

  activateButton: { 
    backgroundColor: "#A6937D", 
    borderRadius: 12,
    marginRight: 12
  },
  
  deactivateButton: { 
    backgroundColor: "#C45E44", 
    borderRadius: 12,
    marginRight: 12
  },
  
  deleteButton: { 
    backgroundColor: "#7D7D7D", 
    borderRadius: 12
  }
});
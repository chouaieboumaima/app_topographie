// src/screens/SettingsScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function SettingsScreen() {
  const navigation = useNavigation();

  // États
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // Animations simples
  const profileChevron = new Animated.Value(0);

  const toggleNotifications = () => setNotificationsEnabled((prev) => !prev);

  const toggleDarkMode = () => setDarkModeEnabled((prev) => !prev);

  const animateChevron = () => {
    Animated.sequence([
      Animated.timing(profileChevron, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(profileChevron, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
    navigation.navigate("Profile");
  };

  const logout = () => {
    Alert.alert(
      "Déconnexion",
      "Voulez-vous vraiment vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Déconnexion",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("access_token");
            await AsyncStorage.removeItem("refresh_token");
            await AsyncStorage.removeItem("user_role");
            navigation.replace("Login");
          },
        },
      ]
    );
  };

  // Styles dynamiques selon mode sombre
  const bgColor = darkModeEnabled ? "#1F2937" : "#F4F6F9";
  const cardColor = darkModeEnabled ? "#2F3B4A" : "#fff";
  const textColor = darkModeEnabled ? "#E5E7EB" : "#2F4858";

  return (
    <ScrollView style={[styles.container, { backgroundColor: bgColor }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <MaterialIcons name="settings" size={28} color="#fff" />
        <Text style={styles.title}>Paramètres</Text>
      </View>

      {/* SECTION PREFERENCES */}
      <Text style={[styles.section, { color: textColor }]}>Préférences</Text>

      {/* Notifications */}
      <View style={[styles.option, { backgroundColor: cardColor }]}>
        <View style={styles.optionLeft}>
          <MaterialIcons name="notifications" size={22} color={textColor} />
          <Text style={[styles.optionText, { color: textColor }]}>Notifications</Text>
        </View>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          trackColor={{ false: "#ccc", true: "#4ADE80" }}
          thumbColor={notificationsEnabled ? "#fff" : "#fff"}
        />
      </View>

      {/* Mode sombre */}
      <View style={[styles.option, { backgroundColor: cardColor }]}>
        <View style={styles.optionLeft}>
          <MaterialIcons name="dark-mode" size={22} color={textColor} />
          <Text style={[styles.optionText, { color: textColor }]}>Mode sombre</Text>
        </View>
        <Switch
          value={darkModeEnabled}
          onValueChange={toggleDarkMode}
          trackColor={{ false: "#ccc", true: "#4ADE80" }}
          thumbColor={darkModeEnabled ? "#fff" : "#fff"}
        />
      </View>

      {/* SECTION PROFIL */}
      <Text style={[styles.section, { color: textColor }]}>Compte</Text>

      {/* Profil */}
      <TouchableOpacity
        style={[styles.option, { backgroundColor: cardColor }]}
        onPress={animateChevron}
        activeOpacity={0.8}
      >
        <View style={styles.optionLeft}>
          <MaterialIcons name="person" size={22} color={textColor} />
          <Text style={[styles.optionText, { color: textColor }]}>Profil</Text>
        </View>
        <Animated.View
          style={{
            transform: [
              {
                translateX: profileChevron.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 5],
                }),
              },
            ],
          }}
        >
          <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
        </Animated.View>
      </TouchableOpacity>

      {/* Déconnexion */}
      <TouchableOpacity
        style={[styles.option, styles.logout, { backgroundColor: "#ac6360" }]}
        onPress={logout}
        activeOpacity={0.8}
      >
        <View style={styles.optionLeft}>
          <MaterialIcons name="logout" size={22} color="#fff" />
          <Text style={[styles.optionText, { color: "#fff" }]}>Se déconnecter</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "#2d363b",
    paddingTop: 60,
    paddingBottom: 25,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginTop: 5,
  },
  section: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 10,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 14,
  },
  logout: {
    marginTop: 20,
  },
});
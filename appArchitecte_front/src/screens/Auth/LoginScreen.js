import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

import { loginUser } from "../../services/authService";
import api from "../../services/api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Permission notifications
  const registerForPushNotificationsAsync = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permission notifications refusée");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      const data = response.data;

      console.log("LOGIN RESPONSE:", data);

      const accessToken = data.access_token || data.token;
      const refreshToken = data.refresh_token || data.refresh;

      if (response.status === 200 && accessToken) {

        // ✅ Sauvegarde tokens
        await AsyncStorage.setItem("access_token", accessToken);
        await AsyncStorage.setItem("refresh_token", refreshToken);
        await AsyncStorage.setItem("user_role", data.user?.role || "user");

        // ✅ Notifications permission
        const permissionGranted = await registerForPushNotificationsAsync();

        if (permissionGranted) {
          try {
            // ✅ Get Expo push token
            const { data: expoPushToken } = await Notifications.getExpoPushTokenAsync();

            console.log("EXPO TOKEN:", expoPushToken);

            // ✅ Send token to backend
            await api.post("/api/notifications/save-token", {
              token: expoPushToken
            });

          } catch (notifError) {
            console.log("Push token error:", notifError);
          }
        }

        // ✅ Navigation
        if (data.user?.role === "admin") {
          navigation.replace("AdminDashboard");
        } else {
          navigation.replace("MainTabs");
        }

      } else {
        alert(data.error || "Erreur de connexion");
      }

    } catch (error) {
      console.log("LOGIN ERROR:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Erreur connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/scan.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Email */}
        <TextInput
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          theme={{
            colors: {
              text: "#fff",
              primary: "#888",
              background: "rgba(255,255,255,0.1)",
            },
          }}
          left={
            <TextInput.Icon
              icon={() => (
                <MaterialCommunityIcons
                  name="email-outline"
                  size={24}
                  color="#fff"
                />
              )}
            />
          }
        />

        {/* Password */}
        <TextInput
          label="Mot de passe"
          mode="outlined"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry={!showPassword}
          theme={{
            colors: {
              text: "#fff",
              primary: "#888",
              background: "rgba(255,255,255,0.1)",
            },
          }}
          left={
            <TextInput.Icon
              icon={() => (
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={24}
                  color="#fff"
                />
              )}
            />
          }
          right={
            <TextInput.Icon
              icon={() => (
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#fff"
                />
              )}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />

        {/* Bouton login */}
        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={{ paddingVertical: 12 }}
          labelStyle={{ color: "#fff" }}
        >
          Se connecter
        </Button>

        {/* Mot de passe oublié */}
        <TouchableOpacity
          style={{ alignSelf: "center", marginTop: 10 }}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          <Text style={{ color: "#fff", textDecorationLine: "underline" }}>
            Mot de passe oublié ?
          </Text>
        </TouchableOpacity>

        {/* Register */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerTextPrompt}>Pas de compte ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Registre")}>
            <Text style={styles.registerText}> Créer un compte</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>© 2026 Architect Robotics</Text>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  input: {
    marginBottom: 20,
    borderRadius: 12,
  },
  button: {
    borderRadius: 12,
    marginTop: 10,
    backgroundColor: "#333",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  registerTextPrompt: {
    color: "#ccc",
  },
  registerText: {
    color: "#fff",
    textDecorationLine: "underline",
  },
  footerText: {
    color: "#aaa",
    textAlign: "center",
    marginTop: 40,
    fontSize: 12,
  },
});
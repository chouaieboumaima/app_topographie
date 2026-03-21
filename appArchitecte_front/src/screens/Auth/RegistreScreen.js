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
import { registerUser } from "../../services/authService";

export default function RegistreScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    setLoading(true);

    try {
      const response = await registerUser({
        name,
        email,
        password,
        password_confirm: passwordConfirm,
      });

      console.log("AXIOS RESPONSE:", response);
      const data = response.data;

      if (response.status === 201) {
        alert("Compte créé !");
        navigation.goBack();
      } else {
        alert(data.error || "Erreur d'inscription");
      }
    } catch (error) {
      if (error.response) {
        console.log("SERVER RESPONSE ERROR:", error.response.data);
        alert(error.response.data.error || "Erreur côté serveur");
      } else if (error.request) {
        console.log("NO RESPONSE:", error.request);
        alert("Le serveur ne répond pas. Vérifie ta connexion ou ton backend.");
      } else {
        console.log("ERROR MESSAGE:", error.message);
        alert("Erreur inconnue: " + error.message);
      }
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
        <Text style={styles.title}>Créer un compte</Text>

        {/* Nom */}
        <TextInput
          label="Nom complet"
          mode="outlined"
          value={name}
          onChangeText={setName}
          style={styles.input}
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
                  name="account-outline"
                  size={24}
                  color="#fff"
                />
              )}
            />
          }
        />

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

        {/* Mot de passe */}
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

        {/* Confirmer mot de passe */}
        <TextInput
          label="Confirmer le mot de passe"
          mode="outlined"
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          style={styles.input}
          secureTextEntry={!showConfirmPassword}
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
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="#fff"
                />
              )}
              onPress={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />
          }
        />

        {/* Bouton */}
        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={{ paddingVertical: 12 }}
          labelStyle={{ color: "#fff" }}
        >
          S'inscrire
        </Button>

        {/* Login */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerTextPrompt}>Déjà un compte ?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.registerText}> Se connecter</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>© 2026 Architect Robotics</Text>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
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
  title: {
    fontSize: 34,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
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
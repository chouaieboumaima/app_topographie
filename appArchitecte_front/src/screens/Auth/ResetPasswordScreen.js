import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { resetPassword } from "../../services/authService";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ResetPasswordScreen({ route, navigation }) {
  const { email, code } = route.params;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleReset = async () => {
    try {
      const response = await resetPassword({
        email,
        code,
        new_password: password,
        password_confirm: confirm,
      });

      if (response.status === 200) {
        alert("Mot de passe modifié !");
        navigation.navigate("Login");
      }
    } catch (error) {
      alert(error.response?.data?.error || "Erreur");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Nouveau mot de passe</Text>
        <Text style={styles.subtitle}>
          Entrez votre nouveau mot de passe et confirmez-le.
        </Text>

        <TextInput
          label="Nouveau mot de passe"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off-outline" : "eye-outline"}
              onPress={() => setShowPassword(!showPassword)}
              color="#555"
            />
          }
          theme={{
            colors: {
              text: "#111",
              primary: "#555",
              background: "#f2f2f2",
              placeholder: "#888",
            },
          }}
        />

        <TextInput
          label="Confirmer"
          secureTextEntry={!showConfirm}
          value={confirm}
          onChangeText={setConfirm}
          style={styles.input}
          right={
            <TextInput.Icon
              icon={showConfirm ? "eye-off-outline" : "eye-outline"}
              onPress={() => setShowConfirm(!showConfirm)}
              color="#555"
            />
          }
          theme={{
            colors: {
              text: "#111",
              primary: "#555",
              background: "#f2f2f2",
              placeholder: "#888",
            },
          }}
        />

        <Button
          mode="contained"
          onPress={handleReset}
          style={styles.button}
          contentStyle={{ paddingVertical: 16 }}
          labelStyle={styles.buttonLabel}
        >
          Réinitialiser
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          labelStyle={styles.backButtonText}
        >
          Retour
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 24,
    padding: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 12,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#222",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  input: {
    marginBottom: 25,
    borderRadius: 18,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  button: {
    borderRadius: 20,
    backgroundColor: "#222",
    marginTop: 10,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  backButtonText: {
    color: "#777",
    marginTop: 20,
    fontSize: 15,
    textDecorationLine: "underline",
    textAlign: "center",
  },
});
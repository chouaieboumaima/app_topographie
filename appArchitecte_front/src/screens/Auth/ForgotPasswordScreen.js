import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { forgotPassword } from "../../services/authService";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    try {
      setLoading(true);
      const response = await forgotPassword({ email });
      if (response.status === 200) {
        alert("Code envoyé à votre email");
        navigation.navigate("VerifyCode", { email });
      }
    } catch (error) {
      alert(error.response?.data?.error || "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Réinitialiser le mot de passe</Text>
        <Text style={styles.subtitle}>
          Entrez votre email pour recevoir un code de réinitialisation.
        </Text>

        <TextInput
          label="Email"
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          theme={{
            colors: {
              text: "#111",
              primary: "#999", // gris bordure focus
              background: "#f5f5f5", // gris clair input
              placeholder: "#888",
            },
          }}
          left={<TextInput.Icon icon="email-outline" color="#666" />}
        />

        <Button
          mode="contained"
          onPress={handleSendCode}
          loading={loading}
          style={styles.button}
          contentStyle={{ paddingVertical: 16 }}
          labelStyle={styles.buttonLabel}
        >
          Envoyer le code
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
    backgroundColor: "#e0e0e0", // fond gris clair
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#fafafa", // card gris très clair
    borderRadius: 24,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#222", // gris très foncé
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555", // gris moyen
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 24,
  },
  input: {
    marginBottom: 25,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  button: {
    borderRadius: 18,
    backgroundColor: "#222", // bouton noir/gris foncé
    marginTop: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  backButtonText: {
    color: "#777", // gris pour texte secondaire
    marginTop: 20,
    fontSize: 15,
    textDecorationLine: "underline",
    textAlign: "center",
  },
});
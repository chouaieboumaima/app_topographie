import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";

export default function VerifyCodeScreen({ route, navigation }) {
  const { email } = route.params;
  const [code, setCode] = useState("");

  const handleVerify = () => {
    navigation.navigate("ResetPassword", { email, code });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Entrer le code reçu</Text>
        <Text style={styles.subtitle}>
          Nous avons envoyé un code à votre email :{" "}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        <TextInput
          label="Code"
          value={code}
          onChangeText={setCode}
          style={styles.input}
          theme={{
            colors: {
              text: "#111",
              primary: "#555", // focus color
              background: "#f2f2f2",
              placeholder: "#888",
            },
          }}
          left={<TextInput.Icon icon="lock-outline" color="#555" />}
        />

        <Button
          mode="contained"
          onPress={handleVerify}
          style={styles.button}
          contentStyle={{ paddingVertical: 16 }}
          labelStyle={styles.buttonLabel}
        >
          Vérifier
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
    backgroundColor: "#f9f9f9", // gris cassé
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
  emailText: {
    fontWeight: "700",
    color: "#333",
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
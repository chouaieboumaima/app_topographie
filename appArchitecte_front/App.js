import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator"; // facultatif si tu veux stack login/details

export default function App() {
  return (
    <NavigationContainer>
      {/* Affiche directement les onglets principaux */}
      <AppNavigator/>
    </NavigationContainer>
  );
}
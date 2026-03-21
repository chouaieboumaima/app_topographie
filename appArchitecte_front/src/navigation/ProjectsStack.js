// src/navigation/ProjectsStack.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProjectsScreen from "../screens/project/ProjectsScreen";
import CloudsScreen from "../screens/project/CloudsScreen";

const Stack = createNativeStackNavigator();

export default function ProjectsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* L’écran initial du stack est la liste des projets */}
      <Stack.Screen name="ProjectsList" component={ProjectsScreen} />
      <Stack.Screen name="Clouds" component={CloudsScreen} />
    </Stack.Navigator>
  );
}
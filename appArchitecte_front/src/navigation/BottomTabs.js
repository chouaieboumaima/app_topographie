// src/navigation/BottomTabs.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

import HomeScreens from "../screens/HomeScreens";
import ProfileScreen from "../screens/profile/ProfileScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import NotificationsScreen from "../screens/notifications/NotificationsScreen";

import ProjectsStack from "./ProjectsStack";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const notificationCount = 3;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Projects") iconName = "apartment";
          else if (route.name === "Notifications") iconName = "notifications";
          else if (route.name === "Profile") iconName = "person";
          else if (route.name === "Settings") iconName = "settings";
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2F4858",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          borderTopWidth: 0,
          elevation: 10,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreens} />
      <Tab.Screen
        name="Projects"
        component={ProjectsStack}
        options={{ unmountOnBlur: true }} // réinitialise le stack quand l'onglet est quitté
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ tabBarBadge: notificationCount > 0 ? notificationCount : null }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
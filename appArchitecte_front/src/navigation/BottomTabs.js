// src/navigation/BottomTabs.js
import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";

import HomeScreens from "../screens/HomeScreens";
import ProfileScreen from "../screens/profile/ProfileScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import NotificationsScreen from "../screens/notifications/NotificationsScreen";
import ProjectsStack from "./ProjectsStack";

import notificationService from "../services/notificationService"; // ✅ pour récupérer les notifications

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const [unreadCount, setUnreadCount] = useState(0);

  // ✅ Charger le nombre de notifications non lues
  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const data = await notificationService.getNotifications();
        const notifications = Array.isArray(data) ? data : [];

        const count = notifications.filter(n => !n.is_read).length;
        setUnreadCount(count);
      } catch (err) {
        console.log("Erreur unread count:", err);
        setUnreadCount(0);
      }
    };

    loadUnreadCount();
  }, []);

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
        options={{ unmountOnBlur: true }}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          // ✅ Maintenant unreadCount existe vraiment
          tabBarBadge: unreadCount > 0 ? unreadCount : null,
        }}
      />

      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
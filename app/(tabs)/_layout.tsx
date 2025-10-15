import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { HapticTab } from "@/components/HapticTab";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#8BA339",
        tabBarInactiveTintColor: "#FFFFFF",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#8BA339",
          borderTopWidth: 0,
          height: 80,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: "Notes",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="document-text-outline"
              size={32}
              color={focused ? "#6B7B28" : "#FFFFFF"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.homeIconContainer,
                focused && styles.homeIconContainerActive,
              ]}
            >
              <Ionicons
                name="home"
                size={28}
                color={focused ? "#6B7B28" : "#6B7B28"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="person-circle-outline"
              size={38}
              color={focused ? "#6B7B28" : "#FFFFFF"}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  homeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E8EFBE",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
  },
  homeIconContainerActive: {
    backgroundColor: "#E8EFBE",
  },
});

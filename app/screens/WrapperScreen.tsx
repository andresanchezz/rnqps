import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import TaskList from "./employee/TaskList";
import TaskHistory from "./employee/TaskHistory";
import TaskListManager from "./manager/TaskListManager";
import { colors } from "../../styles/colors";
import UserProfile from "./UserProfile";
import UsersServices from "../services/UsersServices";
import { UserInfo } from "../models/user-info";


// Tab Navigator
const Tab = createBottomTabNavigator();

// Menú para empleados
const BottomNavEmployees = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
          Task: "list-outline",
          History: "file-tray-stacked-outline",
          Profile: "person-circle-outline",
        };
        return <Ionicons name={icons[route.name]} color={colors.primary} size={size} />;
      },
    })}
  >
    <Tab.Screen name="Task" component={TaskList} />
    <Tab.Screen name="History" component={TaskHistory} />
    <Tab.Screen name="Profile" component={UserProfile} />
  </Tab.Navigator>
);

// Menú para administradores
const BottomNavManagers = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
          Tasks: "list-outline",
          Profile: "person-circle-outline",
        };
        return <Ionicons name={icons[route.name]} color={colors.primary} size={size} />;
      },
    })}
  >
    <Tab.Screen name="Tasks" component={TaskListManager} />
    <Tab.Screen name="Profile" component={UserProfile} />
  </Tab.Navigator>
);


const MainView: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userId = await SecureStore.getItemAsync("userId");
        if (!userId) {
          throw new Error("ID de usuario no encontrado");
        }

        const userInfo:UserInfo = await UsersServices.getUserInf(userId);

        if (!userInfo || !userInfo.roleId) {
          throw new Error("Información del usuario no válida");
        }

        if (userInfo) await SecureStore.setItemAsync('userInfo', JSON.stringify(userInfo));

        setRole(userInfo.roleId);

      } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {role === "1" ? <BottomNavManagers /> : <BottomNavEmployees />}
    </View>
  );
};

// 📌 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MainView;
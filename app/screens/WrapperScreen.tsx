import React from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import TaskList from "./employee/TaskList";
import TaskHistory from "./employee/TaskHistory";

// 📌 Tipado para los roles permitidos
type UserRole = "admin" | "employee";

// 📌 Tab Navigator
const Tab = createBottomTabNavigator();

// 📌 Menú para empleados
const BottomNavEmployees = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
          Home: "home",
          Employee: "person",
        };
        return <Ionicons name={icons[route.name]} color={color} size={size} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={TaskList} />
    <Tab.Screen name="Employee" component={TaskHistory} />
  </Tab.Navigator>
);

// 📌 Menú para administradores
const BottomNavManagers = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
          Home: "home",
          Manager: "settings",
        };
        return <Ionicons name={icons[route.name]} color={color} size={size} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={TaskList} />
    <Tab.Screen name="Manager" component={TaskList} />
  </Tab.Navigator>
);

// 📌 Componente de la vista central
const MainView: React.FC<{ role: UserRole }> = ({ role }) => {
  return (
    <View style={styles.container}>

        {role === "admin" ? <BottomNavManagers /> : <BottomNavEmployees />}
      
    </View>
  );
};

export default MainView;

// 📌 Estilos
const styles = StyleSheet.create({
  container: { flex: 1},
});

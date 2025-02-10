import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Avatar, Text } from "react-native-paper";
import * as SecureStore from "expo-secure-store";
import { colors } from "../../styles/colors";
import { buttonStyles } from "../../styles/styles";
import UsersServices from "../services/UsersServices";
import { RootParamList } from "../models/root-param-list";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

type SplashScreenNavigationProp = StackNavigationProp<RootParamList, "Splash">;

const UserProfile = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener los datos del usuario
  const fetchUserInfo = async () => {
    try {
      // 1. Obtener los datos del usuario desde SecureStore
      const userInfoString = await SecureStore.getItemAsync("userInfo");
      if (!userInfoString) {
        throw new Error("No se encontró la información del usuario");
      }

      // 2. Convertir la cadena JSON a un objeto
      const userInfo = JSON.parse(userInfoString);

      // 3. Actualizar el estado con los datos del usuario
      setUserInfo(userInfo);
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar los datos del usuario al montar el componente
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const signOut = async () => {
    await UsersServices.signOut();
    navigation.push("Splash");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Avatar.Icon
        color={colors.light}
        size={130}
        icon="account"
        style={{ backgroundColor: colors.primary }}
      />

      <View style={{ marginTop: 20 }}>
        <Text style={{ textAlign: "center" }} variant="titleLarge">
          {userInfo?.name || "Nombre no disponible"}
        </Text>
        <Text variant="bodyLarge" style={{ marginVertical: 20, textAlign: "center" }}>
          {userInfo?.email || "Correo no disponible"}
        </Text>
      </View>

      <TouchableOpacity style={[buttonStyles.button, styles.fullW]} onPress={signOut}>
        <Text style={buttonStyles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    backgroundColor: colors.light,
    alignItems: "center",
    justifyContent: "center",
  },
  fullW: {
    width: "80%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
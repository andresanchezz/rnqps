import React, { useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native";
import { Text, IconButton, Avatar } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { buttonStyles } from "../../../styles/styles";
import { colors } from "../../../styles/colors";
import * as SecureStore from 'expo-secure-store';
import useProfile from "./hooks/useProfile.hook";

export const ProfileScreen = () => {
  const { t } = useTranslation();
  const { signOut, changeLanguage } = useProfile();

  const userString = SecureStore.getItem('userData');
  const user = userString ? JSON.parse(userString) : null;

  const heightx = Dimensions.get('screen').height;

  const [isLanguageExpanded, setIsLanguageExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const toggleLanguageExpand = () => {
    setIsLanguageExpanded(!isLanguageExpanded);
    Animated.timing(animatedHeight, {
      toValue: isLanguageExpanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleLanguageChange = (language: string) => {
    changeLanguage(language);
    setIsLanguageExpanded(false);
    Animated.timing(animatedHeight, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const styles = StyleSheet.create({
    screen: {
      paddingVertical: 50,
      paddingHorizontal: 20,
      flex: 1,
      backgroundColor: colors.light,
    },
    avatar: {
      backgroundColor: colors.primary,
    },
    headBox: {
      alignItems: 'center',
      height: heightx * 0.25,
      justifyContent: 'space-between',
      marginBottom: heightx * 0.020,
    },
    mainBox: {
      flex: 1,
      justifyContent: 'space-between',
    },
    languageCard: {
      width: '100%',
      padding: 16,
      backgroundColor: "#FFFFFF",
      borderBottomWidth: 0.5,
      borderBottomColor: "#E0E0E0",
      overflow: "hidden",
    },
    languageRow: {
      alignItems: "center", 
    },
    languageRowText: {
      color: colors.primary
    },
    languageContent: {
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 0.5,
      borderTopColor: "#E0E0E0",
    },
    languageButton: {
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 5,
    },
  });

  return (
    <View style={styles.screen}>
      <View style={styles.headBox}>
        <Avatar.Icon style={styles.avatar} size={130} color={colors.light} icon="account" />
        <Text variant="bodyLarge">{user?.name}</Text>
        <Text variant="bodyLarge">{user?.email}</Text>
      </View>

      <View style={styles.mainBox}>
        <TouchableOpacity onPress={toggleLanguageExpand} activeOpacity={0.8}>
          <Animated.View
            style={[
              styles.languageCard,
              {
                height: animatedHeight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [60, 190],
                }),
              },
            ]}
          >
            <View style={styles.languageRow}>
              <Text style={styles.languageRowText} variant="bodyLarge">{t("selectLanguage")}</Text>
            </View>
            {isLanguageExpanded && (
              <Animated.View
                style={[
                  styles.languageContent,
                  {
                    opacity: animatedHeight.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                  },
                ]}
              >
                <TouchableOpacity style={styles.languageButton} onPress={() => handleLanguageChange('en')}>
                  <Text variant="bodyLarge">{t("english")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.languageButton} onPress={() => handleLanguageChange('es')}>
                  <Text variant="bodyLarge">{t("spanish")}</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </Animated.View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={buttonStyles.button} onPress={signOut}>
        <Text style={buttonStyles.buttonText}>{t("logOut")}</Text>
      </TouchableOpacity>
    </View>
  );
};

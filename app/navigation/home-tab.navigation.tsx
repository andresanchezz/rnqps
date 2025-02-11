import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import React from "react";

import { colors } from "../../styles/colors";

const Tab = createBottomTabNavigator();

const HomeTabNavigation = () => {
    return (
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
            <Tab.Screen name="ServicesScreen" component={React.Fragment} />
            <Tab.Screen name="HistoryScreen" component={React.Fragment} />
            <Tab.Screen name="ProfileScreen" component={React.Fragment} />
        </Tab.Navigator>
    )
};

export default HomeTabNavigation;

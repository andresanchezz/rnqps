import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../../styles/colors";
import ServicesScreen from '../screens/services-screen/ServicesScreen';
import HistoryScreen from '../screens/history-screen/HistoryScreen';
import { ProfileScreen } from '../screens/profile-screen/ProfileScreen';
import { useTranslation } from 'react-i18next';



const Tab = createBottomTabNavigator();

const HomeTabNavigation = () => {

    const { t } = useTranslation();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ size }) => {
                    const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
                        ServicesScreen: "list-outline",
                        HistoryScreen: "file-tray-stacked-outline",
                        ProfileScreen: "person-circle-outline",
                    };
                    return <Ionicons name={icons[route.name]} color={colors.primary} size={size} />;
                },
            })}
        >
            <Tab.Screen options={{ title: `${t("services")}` }} name="ServicesScreen" component={ServicesScreen} />
            <Tab.Screen options={{
                title: `${t("history")}`,
                headerShown: true,
                headerTitleAlign: 'center'
            }} name="HistoryScreen" component={HistoryScreen} />
            <Tab.Screen options={{ title: `${t("profile")}` }} name="ProfileScreen" component={ProfileScreen} />
        </Tab.Navigator>
    )
};

export default HomeTabNavigation;

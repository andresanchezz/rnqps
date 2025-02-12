import { createStackNavigator } from '@react-navigation/stack'

import HomeTabNavigation from './home-tab.navigation'

const Stack = createStackNavigator()

const HomeStackNavigation = () => {
    return (
        <Stack.Navigator initialRouteName="HomeTabNavigation"
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="HomeTabNavigation" component={HomeTabNavigation} />
        </Stack.Navigator>
    )
}

export default HomeStackNavigation;

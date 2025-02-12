import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../../../state';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../../../navigation/kickoff-stack.navigation';


type NavigationProp = StackNavigationProp<RootParamList, 'LoginScreen'>;

const useProfile = () => {

    const navigation = useNavigation<NavigationProp>();

    const { user } = useAuthStore();

    const signOut = async() =>{

        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('userId');
        await SecureStore.deleteItemAsync('email');

        navigation.navigate('LoginScreen');
    }


    return {
        signOut,
        user
    }

}

export default useProfile;

import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../../../state';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../../../navigation/kickoff-stack.navigation';
import { useTranslation } from 'react-i18next';


type NavigationProp = StackNavigationProp<RootParamList, 'LoginScreen'>;

const useProfile = () => {

    const navigation = useNavigation<NavigationProp>();

    const { i18n } = useTranslation();
    const store = useAuthStore();
    const {  user } = useAuthStore();

    const handleSignOut = async () => {

         store.signOut();
    }

    const changeLanguage = async (lng:string) => {
        await i18n.changeLanguage(lng);
        await SecureStore.setItemAsync('userLanguage', lng); 
      };


    return {
        signOut: handleSignOut,
        changeLanguage,
        user
    }

}

export default useProfile;

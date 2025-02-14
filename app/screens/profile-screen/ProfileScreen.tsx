import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Avatar, Text } from 'react-native-paper'
import { buttonStyles } from '../../../styles/styles'
import { colors } from '../../../styles/colors'
import { typography } from '../../../styles/typography'
import useProfile from './hooks/useProfile.hook'
import { useAuthStore } from '../../state'
import { useTranslation } from 'react-i18next'

export const ProfileScreen = () => {

  const { t } = useTranslation();

  const { signOut, changeLanguage } = useProfile();
  const userData = useAuthStore().user;

  return (
    <View style={styles.screen}>
      <View style={styles.mainContainer}>
        <Avatar.Icon color={colors.light} size={120} style={styles.avatarIcon} icon="account"></Avatar.Icon>

        <Text style={[styles.userName]}>{userData?.name}</Text>


        <Text>{userData?.email}</Text>


    <Text>{t("welcome")}</Text>

        <TouchableOpacity style={[buttonStyles.button, styles.buttonWidth]} onPress={()=>changeLanguage('es')}>
          <Text style={buttonStyles.buttonText}>Español</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[buttonStyles.button, styles.buttonWidth]} onPress={()=>changeLanguage('en')}>
          <Text style={buttonStyles.buttonText}>Inglés</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[buttonStyles.button, styles.buttonWidth]} onPress={signOut}>
          <Text style={buttonStyles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({


  screen:{
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light,
    flex: 1,
  },
  mainContainer: {
    height: 300,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  buttonWidth: {
    width: '100%'
  },
  userName: {
    ...typography.headingMedium.bold,
    textTransform: 'capitalize',
  },
  avatarIcon: {
    backgroundColor: colors.primary,

  }
})
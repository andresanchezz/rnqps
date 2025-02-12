import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Avatar, Text } from 'react-native-paper'
import { buttonStyles } from '../../../styles/styles'
import { colors } from '../../../styles/colors'
import { typography } from '../../../styles/typography'
import useProfile from './hooks/useProfile.hook'

export const ProfileScreen = () => {

  const { signOut } = useProfile();

  return (
    <View style={styles.screen}>
      <View style={styles.mainContainer}>
        <Avatar.Icon color={colors.light} size={120} style={styles.avatarIcon} icon="account"></Avatar.Icon>

        <Text style={[styles.userName]}>andres sanchez</Text>


        <Text>eduardo.sanchez@email.com</Text>


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
/* // themes.js
import { DarkTheme } from '@react-navigation/native';
import { DefaultTheme} from 'react-native-paper';
import { colors } from './colors';

export const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,  // Color principal en modo claro
    accent: '#03dac4',   // Color de acento en modo claro
    background: '#ffffff', // Fondo del modo claro
    surface: '#f3f3f3',    // Color de las superficies
    text: '#000000',       // Texto en modo claro
  },
};

export const darkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#bb86fc',  // Color principal en modo oscuro
    accent: '#03dac4',   // Color de acento en modo oscuro
    background: '#121212', // Fondo del modo oscuro
    surface: '#333333',    // Color de las superficies
    text: '#ffffff',       // Texto en modo oscuro
  },
};
 */
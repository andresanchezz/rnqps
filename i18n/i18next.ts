import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as SecureStore from 'expo-secure-store';

import es from '../locales/es.json';
import en from '../locales/en.json';


const getSavedLanguage = async () => {
  try {
    const savedLanguage = await SecureStore.getItemAsync('userLanguage');
    return savedLanguage || 'en'; 
  } catch (error) {
    console.error('Error al obtener el idioma guardado:', error);
    return 'en';
  }
};


const initializeI18n = async () => {
  const lng = await getSavedLanguage();

  i18n.use(initReactI18next).init({
    resources: {
      en: {
        translation: en,
      },
      es: {
        translation: es,
      },
    },
    lng: lng, 
    fallbackLng: 'en', 
    interpolation: {
      escapeValue: false,
    },
  });
};

initializeI18n(); 

export default i18n;
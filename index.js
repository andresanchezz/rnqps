import { registerRootComponent } from 'expo';

import App from './App';

import * as Sentry from "@sentry/react-native";

/* Sentry.init({
  dsn: "https://<your-dsn>@o0.ingest.sentry.io/0", //TODO: cambiar ruta
  enableNative: true, // Habilita la captura de errores nativos
  tracesSampleRate: 1.0, // Controla la tasa de muestreo de rendimiento
}); */


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

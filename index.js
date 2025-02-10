import { registerRootComponent } from 'expo';

import App from './App';

import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://3bae967ea3db4960a6943e9cb2120748@bugsink.servicesqps.com/1", 
  enableNative: true, 
  tracesSampleRate: 1.0, 
}); 

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDO-6fz_Xdc99u8kW2nXKcyo3e25PgE6yI",
  authDomain: "services-qps.firebaseapp.com",
  projectId: "services-qps",
  storageBucket: "services-qps.firebasestorage.app",
  messagingSenderId: "232640078697",
  appId: "1:232640078697:web:2bb7d48f491ea3914fd3f8",
  measurementId: "G-HC20R6DC5B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

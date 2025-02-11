import * as Sentry from "@sentry/react-native";
import { registerRootComponent } from 'expo';

import App from './App';

Sentry.init({
  dsn: "https://3bae967ea3db4960a6943e9cb2120748@bugsink.servicesqps.com/1",
  enableNative: true,
  tracesSampleRate: 1.0,
});

registerRootComponent(App);

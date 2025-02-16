import { Route } from "react-native-tab-view";

export type TabRoute = Route & {
  key: string;
  title: string;
};
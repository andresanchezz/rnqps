import { TextStyle } from "react-native";

export const typography = {
  headingLarge: {
    black: { fontSize: 32, fontWeight: 900 as TextStyle["fontWeight"] },
    bold: { fontSize: 32, fontWeight: "bold" },
    medium: { fontSize: 32, fontWeight: 500 as TextStyle["fontWeight"] },
    regular: { fontSize: 32, fontWeight: "normal" },
  },

  headingMedium: {
    black: { fontSize: 24, fontWeight: 900 as TextStyle["fontWeight"] },
    bold: { fontSize: 24, fontWeight: "bold" },
    medium: { fontSize: 24, fontWeight: 500 as TextStyle["fontWeight"] },
    regular: { fontSize: 24, fontWeight: "normal" },
  },

  bodyLarge: {
    black: { fontSize: 16, fontWeight: 900 as TextStyle["fontWeight"] },
    bold: { fontSize: 16, fontWeight: "bold" },
    medium: { fontSize: 16, fontWeight: 500 as TextStyle["fontWeight"] },
    regular: { fontSize: 16, fontWeight: "normal" },
  },

  bodySmall: {
    black: { fontSize: 12, fontWeight: 900 as TextStyle["fontWeight"] },
    bold: { fontSize: 12, fontWeight: "bold" },
    medium: { fontSize: 12, fontWeight: 500 as TextStyle["fontWeight"] },
    regular: { fontSize: 12, fontWeight: "normal" },
  },
};

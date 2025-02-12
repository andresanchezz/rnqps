import { TextStyle } from "react-native";

type TypographyStyle = {
  fontSize: number;
  fontWeight: TextStyle["fontWeight"];
};

export const typography = {
  headingLarge: {
    black: { fontSize: 32, fontWeight: "900" } as TypographyStyle,
    bold: { fontSize: 32, fontWeight: "bold" } as TypographyStyle,
    medium: { fontSize: 32, fontWeight: "500" } as TypographyStyle,
    regular: { fontSize: 32, fontWeight: "normal" } as TypographyStyle,
  },

  headingMedium: {
    black: { fontSize: 24, fontWeight: "900" } as TypographyStyle,
    bold: { fontSize: 24, fontWeight: "bold" } as TypographyStyle,
    medium: { fontSize: 24, fontWeight: "500" } as TypographyStyle,
    regular: { fontSize: 24, fontWeight: "normal" } as TypographyStyle,
  },

  bodyLarge: {
    black: { fontSize: 16, fontWeight: "900" } as TypographyStyle,
    bold: { fontSize: 16, fontWeight: "bold" } as TypographyStyle,
    medium: { fontSize: 16, fontWeight: "500" } as TypographyStyle,
    regular: { fontSize: 16, fontWeight: "normal" } as TypographyStyle,
  },

  bodySmall: {
    black: { fontSize: 12, fontWeight: "900" } as TypographyStyle,
    bold: { fontSize: 12, fontWeight: "bold" } as TypographyStyle,
    medium: { fontSize: 12, fontWeight: "500" } as TypographyStyle,
    regular: { fontSize: 12, fontWeight: "normal" } as TypographyStyle,
  },
};
import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { typography } from "./typography";


const buttonPadding = 10;
const buttonBorderRadius = 4;

export const buttonStyles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        padding: buttonPadding,
        borderRadius: buttonBorderRadius,
    },

    buttonText: {
        textAlign: "center",
        color: colors.buttonText,
        ...typography.bodyLarge.bold,
    },
});

export const modalStyles = StyleSheet.create({  
    area:{
        padding: 20
    },
    title:{
        ...typography.bodyLarge.bold
    },
    text:{
        ...typography.bodyLarge.regular
    },
    inputSpacing:{
        height: 20
    }
});

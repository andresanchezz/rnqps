import { StyleSheet } from "react-native";
import { colors } from "./colors";



const buttonPadding = 10;
const buttonBorderRadius = 4;

export const buttonStyles = StyleSheet.create({
    button: {
        backgroundColor: colors.secondary,
        padding: buttonPadding,
        borderRadius: buttonBorderRadius,
    },

    buttonText: {
        textAlign: "center",
        color: colors.buttonText,
    },
});

export const modalStyles = StyleSheet.create({  
    area:{
        padding: 20
    },

    inputSpacing:{
        height: 20
    }
    
});

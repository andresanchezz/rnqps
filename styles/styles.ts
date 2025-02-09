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


/*
2️⃣ Encabezados Principales (Screens y Secciones)
headingLarge → Para los títulos de pantalla principales o secciones importantes.
Ejemplo: "Mis Reservas", "Configuración", "Perfil".
2️⃣ Encabezados Medianos (Titulares en Cards o Modales)
headingMedium → Para títulos dentro de tarjetas o modales.
Ejemplo: "Detalles del Pedido", "Resumen de Pago".
3️⃣ Encabezados Pequeños (Subtítulos y Secciones dentro de Cards/Modales)
headingSmall → Para subtítulos o secciones secundarias.
Ejemplo: "Método de Pago", "Productos Seleccionados".
4️⃣ Texto Regular (Cuerpo de Cards y Modales)
bodyMedium → Para descripciones generales y texto principal.
Ejemplo: "Tu pedido llegará en 20-30 min", "Este producto tiene 4.5 estrellas".
bodySmall → Para detalles secundarios o textos menos importantes.
Ejemplo: "Última actualización: 10 min atrás".
5️⃣ Etiquetas y Botones
labelLarge → Para botones importantes y destacados.
Ejemplo: "Confirmar", "Pagar Ahora".
labelSmall → Para etiquetas de información o botones secundarios.
Ejemplo: "Cancelar", "Ver más". */

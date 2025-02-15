import React, { useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Text, Avatar, IconButton } from "react-native-paper";
import { Service } from "../../../interfaces/services/services.interface";
import useCardBehaviour from "./hooks/useCardBehaviour.hook";
import { typography } from "../../../../styles/typography";
import { useTranslation } from "react-i18next";

interface CardServiceProps {
    service: Service;

    onAccept?: () => void; 
    onDeny?: () => void; 
    onConfirm?: () => void; 
    hideButtons?: boolean; 
}

const CardService: React.FC<CardServiceProps> = ({
    service,
    onAccept,
    onDeny,
    onConfirm,
    hideButtons = false 
}) => {
    const { toggleExpand, animatedHeight, isExpanded } = useCardBehaviour();

    const {t} = useTranslation();

    const showButtons = !hideButtons && (onAccept || onDeny || onConfirm);

    return (
        <View>
            <Animated.View
                style={[
                    styles.card,
                    {
                        height: animatedHeight.interpolate({
                            inputRange: [0, 1],
                            outputRange: [100, 270],
                        }),
                    },
                ]}
            >
                <View style={styles.row}>
                    <TouchableOpacity onPress={toggleExpand} activeOpacity={0.8} style={styles.contentContainer}>
                        <View style={styles.row}>
                            <Avatar.Icon size={40} icon="file" style={styles.roundedAvatar} />
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{service.type?.cleaningType}</Text>
                                <Text style={styles.description}>{service.unitySize}</Text>
                                <Text style={styles.description}>{t("unit")}: {service.unitNumber}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {showButtons && (
                        <View style={styles.buttonsContainer}>
                            {onAccept && (
                                <IconButton
                                    icon="check"
                                    size={24}
                                    onPress={onAccept}
                                    style={styles.iconButton}
                                />
                            )}
                            {onDeny && (
                                <IconButton
                                    icon="close"
                                    size={24}
                                    onPress={onDeny}
                                    style={styles.iconButton}
                                />
                            )}
                            {onConfirm && (
                                <IconButton
                                    icon="check-all"
                                    size={24}
                                    onPress={onConfirm}
                                    style={styles.iconButton}
                                />
                            )}
                        </View>
                    )}
                </View>
                {isExpanded && (
                    <Animated.View
                        style={[
                            styles.content,
                            {
                                opacity: animatedHeight.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 1],
                                }),
                            },
                        ]}
                    >
                        <Text style={typography.bodyLarge.bold}>{t("comment")}: <Text>{service.comment || "N/A"}</Text></Text>
                        <Text style={typography.bodyLarge.bold}>{t("schedule")}: <Text>{service.schedule || "N/A"}</Text></Text>
                        <Text style={typography.bodyLarge.bold}>{t("communityName")}: <Text>{service.community?.communityName || "N/A"}</Text></Text>
                        <Text style={typography.bodyLarge.bold}>{t("status")}: <Text>{service.status?.statusName || "N/A"}</Text></Text>
                        <Text style={typography.bodyLarge.bold}>{t("user")} ID: <Text>{service.userId || "N/A"}</Text></Text>
                        <Text style={typography.bodyLarge.bold}>{t("service")} ID: <Text>{service.id}</Text></Text>
                        
                    </Animated.View>
                )}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 4,
        padding: 16,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 0.5,
        borderBottomColor: "#E0E0E0",
        overflow: "hidden",
    },
    row: {
        flexDirection: "row",
    },
    roundedAvatar: {
        backgroundColor: "#E0E0E0",
        borderRadius: 20,
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000000",
    },
    description: {
        fontSize: 14,
        color: "#666666",
        marginTop: 4,
    },
    content: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 0.5,
        borderTopColor: "#E0E0E0",
    },
    buttonsContainer: {
        flexDirection: "row",
        alignItems: 'center',
        marginRight: 10,
    },
    iconButton: {
        margin: 0,
    },
    contentContainer: {
        flex: 1,
    },
});

export default CardService;
import React, { useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Text, Avatar, IconButton } from "react-native-paper";
import { DataService } from "../../../interfaces/services/services.interface";
import useCardBehaviour from "./hooks/useCardBehaviour.hook";

import { useTranslation } from "react-i18next";

interface CardServiceProps {
    service: DataService;
    onAccept?: () => void;
    onReject?: () => void;
    onConfirm?: () => void;
    onReassign?: () => void;
    hideButtons?: boolean;
    userRole?: string;
    currentView?: string;
}

const CardService: React.FC<CardServiceProps> = React.memo(({
    service,
    onAccept,
    onReject,
    onReassign,
    onConfirm,
    hideButtons = false,
    userRole,
    currentView
}) => {
    const { toggleExpand, animatedHeight, isExpanded } = useCardBehaviour();
    const { t } = useTranslation();


    const showAcceptButton = userRole === "4" && currentView === "pending";
    const showRejectButton = userRole === "4" && currentView === "pending";
    const showConfirmButton = userRole === "4" && currentView === "approved";
    const showReassign = userRole === "1";

    const handleAccept = useCallback(() => onAccept?.(), [onAccept]);
    const handleReject = useCallback(() => onReject?.(), [onReject]);
    const handleConfirm = useCallback(() => onConfirm?.(), [onConfirm]);
    const handleReassign = useCallback(() => onReassign?.(), [onReassign]);

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
                    {!hideButtons && (
                        <View style={styles.buttonsContainer}>
                            {showAcceptButton && <IconButton icon="check" size={24} onPress={handleAccept} style={styles.iconButton} />}
                            {showRejectButton && <IconButton icon="close" size={24} onPress={handleReject} style={styles.iconButton} />}
                            {showConfirmButton && <IconButton icon="check-all" size={24} onPress={handleConfirm} style={styles.iconButton} />}
                            {showReassign && <IconButton icon="star" size={24} onPress={handleReassign} style={styles.iconButton} />}
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
                        <Text variant="bodyMedium" >{t("comment")}: <Text>{service.comment || "N/A"}</Text></Text>
                        <Text variant="bodyMedium" >{t("schedule")}: <Text>{service.schedule || "N/A"}</Text></Text>
                        <Text variant="bodyMedium" >{t("communityName")}: <Text>{service.community?.communityName || "N/A"}</Text></Text>
                        <Text variant="bodyMedium" >{t("status")}: <Text>{service.status?.statusName || "N/A"}</Text></Text>
                        <Text variant="bodyMedium" >{t("user")} ID: <Text>{service.userId || "N/A"}</Text></Text>
                        <Text variant="bodyMedium" >{t("service")} ID: <Text>{service.id}</Text></Text>
                    </Animated.View>
                )}
            </Animated.View>
        </View>
    );
});

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
        alignItems: "center",
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
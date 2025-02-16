import React, { useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { Roles } from '../../../../interfaces/roles.interface';

const useCardBehaviour = () => {

    const animatedHeight = useRef(new Animated.Value(0)).current;
    const [isExpanded, setIsExpanded] = useState(false);

    /* const statusColors: Record<string, string> = {
        CREATED: "#3498db",
        PENDING: "#f1c40f",
        APPROVED: "#2ecc71",
        REJECTED: "#e74c3c",
        COMPLETED: "#9b59b6",
        FINISHED: "#95a5a6",
    }; */

    /* const allowedActions = {
        [Roles.SUPER_ADMIN]: {
            canAcceptService: { status: false, function: acceptService },
            canRejectService: { status: false, function: RejectService },
            canAddAttachments: { status: false, function: addAttachments },
        },
        [Roles.PANEL_USER]: {
            canAcceptService: { status: false, function: acceptService },
            canRejectService: { status: false, function: RejectService },
            canAddAttachments: { status: false, function: addAttachments },
        },
        [Roles.MANAGER]: {
            canAcceptService: { status: false, function: acceptService },
            canRejectService: { status: false, function: RejectService },
            canAddAttachments: { status: false, function: addAttachments },
        },
        [Roles.CLEANER]: {
            canAcceptService: { status: true, function: acceptService },
            canRejectService: { status: true, function: RejectService },
            canAddAttachments: { status: true, function: addAttachments },
        },
    }; */


    /* const roleKey = getRoleKey(role);
    const actions = roleKey ? allowedActions[Roles[roleKey]] : {}; */


    const toggleExpand = () => {

        const toValue = isExpanded ? 0 : 1;
        Animated.timing(animatedHeight, {
            toValue,
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: false,
        }).start();
        setIsExpanded(!isExpanded);
    };


    return {
        toggleExpand,
        animatedHeight,
        isExpanded,
    };
};

export default useCardBehaviour;
import React, { useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { Roles } from '../../../../interfaces/roles/roles.interface';

const useCardBehaviour = (role: string) => {
    
    const animatedHeight = useRef(new Animated.Value(0)).current;
    const [isExpanded, setIsExpanded] = useState(false);


    const addAttachments = () => {
        console.log('Adjuntos añadidos');
    };


    const getRoleKey = (role: string): keyof typeof Roles | undefined => {
        return Object.keys(Roles).find((key) => Roles[key as keyof typeof Roles] === role) as keyof typeof Roles;
    };


    /* const allowedActions = {
        [Roles.SUPER_ADMIN]: {
            canAcceptService: { status: false, function: acceptService },
            canDenyService: { status: false, function: denyService },
            canAddAttachments: { status: false, function: addAttachments },
        },
        [Roles.PANEL_USER]: {
            canAcceptService: { status: false, function: acceptService },
            canDenyService: { status: false, function: denyService },
            canAddAttachments: { status: false, function: addAttachments },
        },
        [Roles.MANAGER]: {
            canAcceptService: { status: false, function: acceptService },
            canDenyService: { status: false, function: denyService },
            canAddAttachments: { status: false, function: addAttachments },
        },
        [Roles.CLEANER]: {
            canAcceptService: { status: true, function: acceptService },
            canDenyService: { status: true, function: denyService },
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
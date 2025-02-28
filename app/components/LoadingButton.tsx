import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { useLoadingStore } from '../state';
import { buttonStyles } from '../../styles/styles';
import { useTranslation } from 'react-i18next';


interface LoadingButton {
    label?: string
    onPress: () => void;
}

export const LoadingButton: React.FC<LoadingButton> = ({ label, onPress }) => {
    const { t } = useTranslation();
    const { isLoading } = useLoadingStore();

    return (
        <TouchableOpacity disabled={isLoading ? true : false}
            style={[buttonStyles.button, isLoading && { backgroundColor: 'gray' }]} onPress={onPress}>

            {
                isLoading ? (
                    <ActivityIndicator />
                )
                    : (
                        <Text style={buttonStyles.buttonText} variant='bodyMedium' >{t(label || 'Click')}</Text>
                    )
            }

        </TouchableOpacity>
    )
}


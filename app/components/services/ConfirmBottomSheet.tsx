import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import useServicesInformation from '../../screens/services-screen/hooks/useServicesInformation.hook';


export const ConfirmBottomSheet = () => {

    const {t} = useTranslation();

    const { handleBottomSheetsActions } = useServicesInformation();

    return (
        <View>
            <Text>{t("confirmService")}</Text>
            <Text>{t("textConfirmService")}</Text>
            <TouchableOpacity onPress={() => { handleBottomSheetsActions('5') }}>
                <Text >{t("confirm")}</Text>
            </TouchableOpacity>
        </View>
    )
}

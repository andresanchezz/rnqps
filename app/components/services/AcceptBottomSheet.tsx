import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import useServicesInformation from '../../screens/services-screen/hooks/useServicesInformation.hook';

export const AcceptBottomSheet = () => {

    const { t } = useTranslation();

    const { handleBottomSheetsActions } = useServicesInformation();

    return (
        <View>
            <Text >{t("acceptService")}</Text>
            <Text >{t("textAcceptService")}</Text>
            <TouchableOpacity onPress={() => { handleBottomSheetsActions('3') }}>
                <Text>{t("confirm")}</Text>
            </TouchableOpacity>
        </View>
    )
}

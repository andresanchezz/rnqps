import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import useServicesInformation from '../../screens/services-screen/hooks/useServicesInformation.hook';


export const RejecBottomSheet = () => {

    const { t } = useTranslation();

    const {
        handleBottomSheetsActions,
        comment,
        setComment

    } = useServicesInformation();

    return (
        <View>
            <Text >{t("rejectService")}</Text>
            <Text >{t("textRejectService")}</Text>
            <TextInput mode="outlined" numberOfLines={8} value={comment} onChangeText={setComment} />
            <View />
            <TouchableOpacity onPress={() => { handleBottomSheetsActions('4') }} >
                <Text>{t("confirm")}</Text>
            </TouchableOpacity>
        </View>
    )
}

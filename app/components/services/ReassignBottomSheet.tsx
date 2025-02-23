import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import useServicesInformation from '../../screens/services-screen/hooks/useServicesInformation.hook';
import { FlatList } from 'react-native-gesture-handler';



export const ReassignBottomSheet = () => {

    const { t } = useTranslation();

    return (

        <View>
            {/* <Text>{t("reassignService")}</Text>
            <Text>{t("textReassignService")}</Text>

            <FlatList

                data={users?.data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.usersListItem, selectedUser?.id === item?.id ? styles.userListItemSelected : ""]}
                        onPress={() => {
                            handleSelectUser(item)
                        }}>
                        <Text
                            style={selectedUser?.id === item?.id ? { color: colors.light } : ""}
                        >{item.name}</Text>
                    </TouchableOpacity>
                )}
            />

            <View style={styles.inputSpacing} />
            <TouchableOpacity onPress={reassignService} style={buttonStyles.button}>
                <Text style={buttonStyles.buttonText}>{t("confirm")}</Text>
            </TouchableOpacity> */}
        </View>

    )
}

import React from 'react'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import useServicesInformation from '../../screens/services-screen/hooks/useServicesInformation.hook';

export const CreateServiceBottomSheet = () => {
    return (
        <View>
            {/* <Text style={styles.bottomSheetTitle}>{t('createService')}</Text>
            <View style={{ height: 15 }}></View>
            <Button mode="outlined" onPress={showDatePicker} style={styles.timeButton}>
                <Text style={{ color: colors.dark }}>
                    {isDateSelected
                        ? `${t('selectedDate')} ${moment(date).format('MMMM D YYYY')}` // Formato: "enero 5 2025"
                        : `${t('selectADate')}`}
                </Text>
            </Button>
            <View style={styles.inputSpacing} />
            <Button mode="outlined" onPress={showTimePicker} style={styles.timeButton}>
                <Text style={{ color: colors.dark }}>
                    {isScheduleSelected
                        ? `${t('selectedTime')} ${moment(schedule).format('hh:mm A')}` // Formato: "02:30 PM"
                        : `${t('selectATime')}`}
                </Text>
            </Button>
            <View style={styles.inputSpacing} />
            <Dropdown
                mode="outlined"
                label={t('unitSize')}
                placeholder={t('selectUnitSize')}
                options={[
                    { label: `1 ${t('bedroom')}`, value: "1 Bedroom" },
                    { label: `2 ${t('bedroom')}`, value: "2 Bedroom" },
                    { label: `3 ${t('bedroom')}`, value: "3 Bedroom" },
                    { label: `4 ${t('bedroom')}`, value: "4 Bedroom" },
                    { label: `5 ${t('bedroom')}`, value: "5 Bedroom" },
                ]}
                value={unitySize}
                onSelect={(value: string | undefined) => setUnitySize(value)}
            />
            <View style={styles.inputSpacing} />
            <TextInput
                mode="outlined"
                placeholder={t('unitNumber')}
                inputMode="numeric"
                value={unityNumber}
                onChangeText={(text) => setUnityNumber(text)}
            />
            <View style={styles.inputSpacing} />
            <Dropdown
                mode="outlined"
                label={t('community')}
                placeholder={t("selectCommunity")}
                options={options?.communities}
                value={communityId}
                onSelect={(value) => setCommunityId(value)}
            />
            <View style={styles.inputSpacing} />
            <Dropdown
                mode="outlined"
                label={t("type")}
                placeholder={t("selectType")}
                options={options?.cleaningTypes}
                value={typeId}
                onSelect={(value) => setTypeId(value)}
            />
            <View style={styles.inputSpacing} />
            <Dropdown
                mode="outlined"
                label="Extras"
                placeholder={t("selectExtras")}
                options={options?.extras}
                value={extraId}
                onSelect={(value) => setExtraId(value)}
            />
            <View style={styles.inputSpacing} />
            <TextInput
                mode="outlined"
                placeholder={t("comment")}
                numberOfLines={4}
                value={comment}
                onChangeText={(text) => setComment(text)}
            />
            <View style={styles.inputSpacing} />
            <TouchableOpacity onPress={() => createNewService()} style={buttonStyles.button}>
                <Text style={buttonStyles.buttonText}>{t("create")}</Text>
            </TouchableOpacity> */}
        </View>
    )
}

import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from "react-native";
import { FAB, PaperProvider, TextInput, Button } from "react-native-paper";
import { colors } from "../../../styles/colors";
import useServicesInformation from "./hooks/useServicesInformation.hook";
import { Dropdown } from "react-native-paper-dropdown";
import { buttonStyles } from "../../../styles/styles";
import { typography } from "../../../styles/typography";
import CustomButtonSheet from "../../components/shared/bottom-sheet/CustomButtonSheet";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import moment from "moment";
import CardService from "../../components/shared/card-task/CardService";
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from "react-i18next";

moment.locale('es');

const ServicesScreen = () => {

      const { t } = useTranslation();

    const isFocused = useIsFocused();

    const {
        services,
        user,
        createNewService,
        schedule,
        setSchedule,
        isScheduleSelected,
        setisScheduleSelected,
        date,
        setDate,
        isDateSelected,
        setIsDateSelected,
        comment,
        setComment,
        unitySize,
        setUnitySize,
        unityNumber,
        setUnityNumber,
        communityId,
        setCommunityId,
        typeId,
        setTypeId,
        extraId,
        setExtraId,
        options,
        setSelectedService,
        createBottomSheet,
        denyBottomSheet,
        acceptBottomSheet,
        openAcceptSheet,
        openDenySheet,
        handleUserSelectedAction,
        openCreateServicesSheet,
        isLoading,
        isRefreshing,
        hasMore,
        refreshServices,
        loadMoreServices,
        servicesByStatus
    } = useServicesInformation();

    useEffect(() => {
        if (isFocused) {
            refreshServices();
        }
    }, [isFocused]);

    const onChangeDate = (event: any, selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate);
            setIsDateSelected(true);
        }
    };

    const onChangeTime = (event: any, selectedTime: Date | undefined) => {
        if (selectedTime) {
            setSchedule(selectedTime);
            setisScheduleSelected(true);
        }
    };

    const showDatePicker = () => {
        DateTimePickerAndroid.open({
            value: date,
            onChange: onChangeDate,
            mode: 'date',
            is24Hour: true,
            minimumDate: new Date(),
        });
    };

    const showTimePicker = () => {
        DateTimePickerAndroid.open({
            value: schedule,
            onChange: onChangeTime,
            mode: 'time',
            is24Hour: true,
        });
    };

    return (
        <View style={styles.mainContainer}>

            
            <FlatList
                data={servicesByStatus.pending}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <CardService
                        key={item.id}
                        service={item}
                        role={user?.roleId!}
                        onAccept={user?.roleId === "4" ? () => {
                            openAcceptSheet();
                            setSelectedService(item);
                        } : undefined}
                        onDeny={user?.roleId === "4" ? () => {
                            openDenySheet();
                            setSelectedService(item);
                        } : undefined}
                    />
                )}
                onEndReached={loadMoreServices}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() => (
                    isLoading ? <Text style={styles.loadingText}>{t("loading")}</Text> :
                    !hasMore ? <Text style={styles.noMoreText}>{t("noMoreServices")}</Text> : null
                )}
                refreshing={isRefreshing}
                onRefresh={refreshServices}
            />

            {user?.roleId === "1" && (
                <FAB
                    style={styles.fab}
                    icon="plus"
                    color={colors.light}
                    onPress={openCreateServicesSheet}
                />
            )}

            {/* Modal para crear un servicio */}
            <CustomButtonSheet ref={createBottomSheet} snapPoints={['50', '90']}>
                <View style={styles.form}>
                    <Text style={styles.bottomSheetTitle}>{t('createService')}</Text>
                    <View style={{ height: 15 }}></View>
                    <Button mode="outlined" onPress={showDatePicker} style={styles.timeButton}>
                        <Text style={{ color: colors.dark }}>
                            {isDateSelected
                                ? `${t('selectedDate')} ${moment(date).format('MMMM D YYYY')}` // Formato: "enero 5 2025"
                                : `${t('selectedADate')}`}
                        </Text>
                    </Button>
                    <View style={styles.inputSpacing} />

                    <Button mode="outlined" onPress={showTimePicker} style={styles.timeButton}>
                        <Text style={{ color: colors.dark }}>
                            {isScheduleSelected
                                ? `${t('selectedTime')} ${moment(schedule).format('hh:mm A')}` // Formato: "02:30 PM"
                                : `${t('selectedATime')}`}
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
                        onSelect={(value) => setUnitySize(value)}
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
                    </TouchableOpacity>
                </View>
            </CustomButtonSheet>

            {/* Modal para aceptar un servicio */}
            <CustomButtonSheet ref={acceptBottomSheet} snapPoints={['10%', '25%']}>
                <View style={styles.form}>
                    <Text style={styles.bottomSheetTitle}>{t("acceptService")}</Text>
                    <Text style={styles.bottomSheetText}>{t("textAcceptService")}</Text>
                    <TouchableOpacity onPress={() => { handleUserSelectedAction('3') }} style={buttonStyles.button}>
                        <Text style={buttonStyles.buttonText}>{t("confirm")}</Text>
                    </TouchableOpacity>
                </View>
            </CustomButtonSheet>

            {/* Modal para rechazar un servicio */}
            <CustomButtonSheet ref={denyBottomSheet} snapPoints={['10%', '35%']}>
                <View style={styles.form}>
                    <Text style={styles.bottomSheetTitle}>{t("denyService")}</Text>
                    <Text style={styles.bottomSheetText}>{t("textDenyService")}</Text>
                    <TextInput mode="outlined" numberOfLines={8} value={comment} onChangeText={setComment} />
                    <View style={styles.inputSpacing} />
                    <TouchableOpacity onPress={() => { handleUserSelectedAction('4') }} style={buttonStyles.button}>
                        <Text style={buttonStyles.buttonText}>{t("confirm")}</Text>
                    </TouchableOpacity>
                </View>
            </CustomButtonSheet>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.light,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: colors.primary,
    },
    form: {
        padding: 20,
    },
    bottomSheetTitle: {
        ...typography.headingMedium.bold,
        textAlign: 'center',
    },
    bottomSheetText: {
        ...typography.bodyLarge.regular,
        textAlign: 'center',
        marginVertical: 16
    },
    inputSpacing: {
        height: 15,
    },
    timeButton: {
        borderRadius: 6
    },
    loadingText: {
        textAlign: 'center',
        marginVertical: 10,
        color: colors.dark,
    },
    noMoreText: {
        textAlign: 'center',
        marginVertical: 10,
        color: colors.dark,
    }
});

export default ServicesScreen;
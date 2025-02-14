import React, { useRef, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
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
import { ScrollView } from "react-native-gesture-handler";

moment.locale('es');

const ServicesScreen = () => {
    const [mode, setMode] = useState<'date' | 'time'>('date');

    const {
        schedule,
        setSchedule,
        isScheduleSelected,
        setisScheduleSelected,
        date,
        setDate,
        isDateSelected,
        setIsDateSelected,
        services,
        user,
        createNewService,
        unitySize,
        setUnitySize,
        unityNumber,
        typeId,
        extraId,
        communityId,
        options,
        comment,
        setComment,
        setCommunityId,
        setExtraId,
        setTypeId,
        setUnityNumber,
        acceptBottomSheet,
        createBottomSheet,
        denyBottomSheet,
        handleUserSelectedAction,
        openAcceptSheet,
        openConfirmSheet,
        setSelectedService,
        openDenySheet,
        openCreateServicesSheet
    } = useServicesInformation();

    const onChange = (event: any, selectedDate: Date | undefined) => {
        if (selectedDate) {
            if (mode === 'date') {
                setDate(selectedDate);
                setIsDateSelected(true);
            } else if (mode === 'time') {
                setSchedule(selectedDate);
                setisScheduleSelected(true);
            }
        }
    };

    const showMode = (currentMode: 'date' | 'time') => {
        setMode(currentMode);
        DateTimePickerAndroid.open({
            value: currentMode === 'date' ? date : schedule,
            onChange,
            mode: currentMode,
            is24Hour: true,
            minimumDate: new Date(),
        });
    };

    return (
        <View style={styles.mainContainer}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {services?.data.map((service) => (
                    <CardService
                        key={service.id}
                        service={service}
                        role={user?.roleId!}
                        onAccept={user?.roleId === "4" ? () => {
                            openAcceptSheet();
                            setSelectedService(service);
                        } : undefined}
                        onDeny={user?.roleId === "4" ? () => {
                            openDenySheet();
                            setSelectedService(service);
                        } : undefined}
                    />
                ))}
            </ScrollView>

            {user?.roleId === "1" && (
                <FAB
                    style={styles.fab}
                    icon="plus"
                    color={colors.light}
                    onPress={openCreateServicesSheet}
                />
            )}

            {/*Modal para crear un servicio*/}
            <CustomButtonSheet ref={createBottomSheet} snapPoints={['50', '90']}>
                <View style={styles.form}>
                    <Text style={styles.bottomSheetTitle}>Crear un servicio</Text>
                    <View style={{ height: 15 }}></View>
                    <Button mode="outlined" onPress={() => showMode('date')} style={styles.timeButton}>
                        <Text style={{ color: colors.dark }}>
                            {isDateSelected
                                ? `Fecha seleccionada: ${moment(date).format('MMMM D YYYY')}` // Formato: "enero 5 2025"
                                : 'Seleccionar fecha'}
                        </Text>
                    </Button>
                    <View style={styles.inputSpacing} />

                    <Button mode="outlined" onPress={() => showMode('time')} style={styles.timeButton}>
                        <Text style={{ color: colors.dark }}>
                            {isScheduleSelected
                                ? `Hora seleccionada: ${moment(schedule).format('hh:mm A')}` // Formato: "02:30 PM"
                                : 'Seleccionar hora'}
                        </Text>
                    </Button>
                    <View style={styles.inputSpacing} />


                    <Dropdown
                        mode="outlined"
                        label="Unit size"
                        placeholder="Select unit size"
                        options={[
                            { label: "1 Bedroom", value: "1 Bedroom" },
                            { label: "2 Bedroom", value: "2 Bedroom" },
                            { label: "3 Bedroom", value: "3 Bedroom" },
                            { label: "4 Bedroom", value: "4 Bedroom" },
                            { label: "5 Bedroom", value: "5 Bedroom" },
                        ]}
                        value={unitySize}
                        onSelect={(value) => setUnitySize(value)}
                    />
                    <View style={styles.inputSpacing} />
                    <TextInput
                        mode="outlined"
                        placeholder="Unit number"
                        inputMode="numeric"
                        value={unityNumber}
                        onChangeText={(text) => setUnityNumber(text)}
                    />
                    <View style={styles.inputSpacing} />
                    <Dropdown
                        mode="outlined"
                        label="Community"
                        placeholder="Select community"
                        options={options?.communities}
                        value={communityId}
                        onSelect={(value) => setCommunityId(value)}
                    />
                    <View style={styles.inputSpacing} />
                    <Dropdown
                        mode="outlined"
                        label="Type"
                        placeholder="Select type"
                        options={options?.cleaningTypes}
                        value={typeId}
                        onSelect={(value) => setTypeId(value)}
                    />
                    <View style={styles.inputSpacing} />
                    <Dropdown
                        mode="outlined"
                        label="Extras"
                        placeholder="Select extras"
                        options={options?.extras}
                        value={extraId}
                        onSelect={(value) => setExtraId(value)}
                    />
                    <View style={styles.inputSpacing} />
                    <TextInput
                        mode="outlined"
                        placeholder="Comment"
                        numberOfLines={4}
                        value={comment}
                        onChangeText={(text) => setComment(text)}
                    />
                    <View style={styles.inputSpacing} />
                    <TouchableOpacity onPress={() => createNewService()} style={buttonStyles.button}>
                        <Text style={buttonStyles.buttonText}>Create</Text>
                    </TouchableOpacity>
                </View>
            </CustomButtonSheet>

            {/* Modal para aceptar un servicio */}
            <CustomButtonSheet ref={acceptBottomSheet} snapPoints={['10%', '25%']}>
                <View style={styles.form}>
                    <Text style={styles.bottomSheetTitle}>¿Aceptar tarea?</Text>
                    <Text style={styles.bottomSheetText}>Vas a aceptar la tarea y se te asignará</Text>
                    <TouchableOpacity onPress={() => { handleUserSelectedAction('3') }} style={buttonStyles.button}>
                        <Text style={buttonStyles.buttonText}>Confirmar</Text>
                    </TouchableOpacity>
                </View>
            </CustomButtonSheet>

            {/* Modal para rechazar un servicio */}
            <CustomButtonSheet ref={denyBottomSheet} snapPoints={['10%', '35%']}>
                <View style={styles.form}>
                    <Text style={styles.bottomSheetTitle}>¿Rechazar servicio?</Text>
                    <Text style={styles.bottomSheetText}>Dinos por qué no aceptas la tarea</Text>
                    <TextInput mode="outlined" numberOfLines={8} value={comment} onChangeText={setComment} />
                    <View style={styles.inputSpacing} />
                    <TouchableOpacity onPress={() => { handleUserSelectedAction('4') }} style={buttonStyles.button}>
                        <Text style={buttonStyles.buttonText}>Confirmar</Text>
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
    }
});

export default ServicesScreen;
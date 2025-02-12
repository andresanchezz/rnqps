import React, { useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { FAB, PaperProvider, TextInput } from "react-native-paper";
import { colors } from "../../../styles/colors";
import useServicesInformation from "./hooks/useServicesInformation.hook";
import CardTask from "../../components/shared/card-task/CardTask";
import { Dropdown } from "react-native-paper-dropdown";
import { buttonStyles } from "../../../styles/styles";
import { typography } from "../../../styles/typography";
import CustomButtonSheet from "../../components/shared/bottom-sheet/CustomButtonSheet";

const ServicesScreen = () => {

    const {
        isLoading,
        schedule,
        services,
        user,
        addNewService,
        unitSize,
        setUnitSize,
        unitNumber,
        typeId,
        extraId,
        communityId,
        options,
        comment,
        setComment,
        setCommunityId,
        setDate,
        setExtraId,
        setSchedule,
        setTypeId,
        setUnitNumber,
        acceptBottomSheet,
        createBottomSheet,
        denyBottomSheet,
        handleUserSelectedAction,
        openAcceptSheet,
        openConfirmSheet,
        setSelectedService,
        openDenySheet
    } = useServicesInformation();

    return (
        <View style={styles.mainContainer}>
            {services?.data.map((service) => (
                <CardTask
                    key={service.id}
                    service={service}
                    role={user?.roleId!}
                    onAccept={() => {
                        openAcceptSheet();
                        setSelectedService(service);
                    }}
                    onDeny={() => { openDenySheet(); setSelectedService(service) }}
                />
            ))}

           {user?.roleId === "4" && <FAB
                style={styles.fab}
                icon="plus"
                color={colors.light}
                onPress={() => createBottomSheet.current?.expand()}
            /> }

            {/* Modal para crear un servicio */}
            <CustomButtonSheet ref={createBottomSheet}>
                <View style={styles.form}>
                    <Text style={styles.bottomSheetTitle}>Crear un servicio</Text>

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
                        value={unitSize}
                        onSelect={(value) => setUnitSize(value)}
                    />
                    <View style={styles.inputSpacing} />
                    <TextInput
                        mode="outlined"
                        placeholder="Unit number"
                        value={unitNumber}
                        onChangeText={(text) => setUnitNumber(text)}
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
                    <TouchableOpacity onPress={() => addNewService()} style={buttonStyles.button}>
                        <Text style={buttonStyles.buttonText}>Create</Text>
                    </TouchableOpacity>

                </View>
            </CustomButtonSheet>

            {/* Modal para aceptar un servicio */}
            <CustomButtonSheet ref={acceptBottomSheet} snapPoints={['10%', '25%']}>
                <View style={styles.form}>
                    <Text style={styles.bottomSheetTitle}>¿Aceptar tarea?</Text>
                    <Text style={styles.bottomSheetText}>Vas a aceptar la tarea y se te asignará</Text>
                    <TouchableOpacity onPress={() => { handleUserSelectedAction('3') }} style={buttonStyles.button} >
                        <Text style={buttonStyles.buttonText}>Confirmar</Text>
                    </TouchableOpacity>
                </View>
            </CustomButtonSheet>

            {/* Modal para rechazar un servicio */}
            <CustomButtonSheet ref={denyBottomSheet} snapPoints={['10%', '35%']}>
                <View style={styles.form}>
                    <Text style={styles.bottomSheetTitle}>¿Rechazar servicio?</Text>
                    <Text style={styles.bottomSheetText}>Dinos por qué no aceptas la tarea</Text>
                    <TextInput mode="outlined" numberOfLines={8} value={comment} onChangeText={setComment}></TextInput>
                    <View style={styles.inputSpacing}></View>
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

});

export default ServicesScreen;
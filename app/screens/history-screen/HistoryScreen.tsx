import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { colors } from "../../../styles/colors";
import useServicesInformation from "../services-screen/hooks/useServicesInformation.hook";
import CardService from "../../components/shared/card-task/CardService";
import { Service } from "../../interfaces/services/services.interface";
import CustomButtonSheet from "../../components/shared/bottom-sheet/CustomButtonSheet";
import { buttonStyles } from "../../../styles/styles";
import { typography } from "../../../styles/typography";

const HistoryScreen = () => {

    const {
        isLoading,
        services,
        user,
        openConfirmSheet,
        confirmBottomSheet
    } = useServicesInformation();


    const pendingServices = services?.data.filter((service: Service) => service.statusId === "3");
    const completedServices = services?.data.filter((service: Service) => service.statusId === "4");


    const PendingTab = () => (
        <View style={styles.tabContainer}>
            {pendingServices?.map((service) => (
                <CardService
                    key={service.id}
                    service={service}
                    role={user?.roleId!}
                    onConfirm={openConfirmSheet}
                />
            ))}
        </View>
    );

    const CompletedTab = () => (
        <View style={styles.tabContainer}>
            {completedServices?.map((service) => (
                <CardService
                    key={service.id}
                    service={service}
                    role={user?.roleId!}

                />
            ))}
        </View>
    );

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "pending", title: "Pendientes" },
        { key: "completed", title: "Completados" },
    ]);

    const renderScene = SceneMap({
        pending: PendingTab,
        completed: CompletedTab,
    });

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: colors.light }}
            style={[{ backgroundColor: colors.secondary }]}
            labelStyle={{ color: colors.dark }}
        />
    );

    return (
        <View style={styles.mainContainer}>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={renderTabBar}
            />


            <CustomButtonSheet ref={confirmBottomSheet} snapPoints={['10%', '25%']}>
                <View style={styles.form}>
                    <Text style={styles.bottomSheetTitle}>¿Aceptar tarea?</Text>
                    <Text style={styles.bottomSheetText}>Vas a aceptar la tarea y se te asignará</Text>
                    <TouchableOpacity onPress={() => { openConfirmSheet }} style={buttonStyles.button}>
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
    tabContainer: {
        flex: 1,
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

export default HistoryScreen;


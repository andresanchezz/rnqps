import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { colors } from "../../../styles/colors";
import useServicesInformation from "../services-screen/hooks/useServicesInformation.hook";
import CardTask from "../../components/shared/card-task/CardTask";
import { Service } from "../../interfaces/services/services.interface";

const HistoryScreen = () => {

    const {
        isLoading,
        services,
        user,
    } = useServicesInformation();


    const pendingServices = services?.data.filter((service: Service) => service.statusId === "3");
    const completedServices = services?.data.filter((service: Service) => service.statusId === "4");


    const PendingTab = () => (
        <View style={styles.tabContainer}>
            {pendingServices?.map((service) => (
                <CardTask
                    key={service.id}
                    service={service}
                    role={user?.roleId!}
                    onAccept={() => { }}
                    onDeny={() => { }}
                />
            ))}
        </View>
    );

    const CompletedTab = () => (
        <View style={styles.tabContainer}>
            {completedServices?.map((service) => (
                <CardTask
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
            indicatorStyle={{ backgroundColor: colors.primary }}
            style={{ backgroundColor: colors.light }}
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
        padding: 16,
    },
});

export default HistoryScreen;
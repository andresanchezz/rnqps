import React, { useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { colors } from "../../../styles/colors";
import useServicesInformation from "../services-screen/hooks/useServicesInformation.hook";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text } from "react-native-paper";
import { RefreshControl } from "react-native-gesture-handler";
import CardService from "../../components/shared/card-task/CardService";
import { Services } from "i18next";
import { ServiceByStatusId } from "../../interfaces/services/services.interface";

const HistoryScreen = () => {

    const { t } = useTranslation();

    const {
        handleGetData,
        servicesByStatus,

        isRefreshing,

    } = useServicesInformation();


    let dataToShow = [
        ...servicesByStatus.completed.data,
        ...servicesByStatus.finished.data
    ]

    const handlePullRefresh = () => {


        Promise.all([
            handleGetData({ page: 1, statusId: "5" }, true),
            handleGetData({ page: 1, statusId: "6" }, true)
        ])


    }

    useEffect(() => {
        Promise.all([
            handleGetData({ page: 1, statusId: "5" }),
            handleGetData({ page: 1, statusId: "6" })
        ])
    }, [])


    return (
        <View style={styles.mainContainer}>

            <FlatList
                data={dataToShow}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <CardService
                        service={item}
                    />
                )}
                //* FLAT LIST
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handlePullRefresh}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
                onEndReached={() => {

                    const currentPageCompleted = servicesByStatus["completed"].meta.page || 1;
                    const currentPageFinished = servicesByStatus["finished"].meta.page || 1;

                    handleGetData({ page: currentPageCompleted + 1, statusId: "5" })
                    handleGetData({ page: currentPageFinished + 1, statusId: "6" })

                }}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: colors.light,
    },
    loadingText: {
        textAlign: "center",
        marginVertical: 10,
        color: colors.dark,
    },
    noMoreText: {
        textAlign: "center",
        marginVertical: 10,
        color: colors.dark,
    },
    flatList: {
        paddingVertical: 12,
    },
});

export default HistoryScreen;

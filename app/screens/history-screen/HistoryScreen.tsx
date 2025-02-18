import React from "react";
import { View, StyleSheet, FlatList } from "react-native"; 
import { colors } from "../../../styles/colors";
import useServicesInformation from "../services-screen/hooks/useServicesInformation.hook";
import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native-paper";
import { RefreshControl } from "react-native-gesture-handler";
import CardService from "../../components/shared/card-task/CardService";

const HistoryScreen = () => {

    const { t } = useTranslation();

    const {
        user,
        allServices
    } = useServicesInformation();

    /* const historyServices = [
        ...allServices
    ]; */

    return (
        <View style={styles.mainContainer}>
            <FlatList
              style={styles.flatList}
              data={allServices?.data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CardService service={item}
                />
              )}
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

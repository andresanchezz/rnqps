import React, { useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { colors } from "../../../styles/colors";
import useServicesInformation from "../services-screen/hooks/useServicesInformation.hook";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text } from "react-native-paper";
import { RefreshControl } from "react-native-gesture-handler";
import CardService from "../../components/shared/card-task/CardService";

const HistoryScreen = () => {

    const { t } = useTranslation();

    useEffect(() => {
      getServices(1, undefined)
    }, [])
    

    const {
        user,
        filteredServices,
        getServices
    } = useServicesInformation();

    return (
        <View style={styles.mainContainer}>
            <FlatList
              style={styles.flatList}
              data={filteredServices.all.data}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CardService service={item} />
              )}
              onEndReached={() => {
                const currentPage = filteredServices.all.meta.page;
                getServices(currentPage + 1);
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

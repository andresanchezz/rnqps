import React from "react";
import { View, StyleSheet, FlatList } from "react-native"; 
import { colors } from "../../../styles/colors";
import useServicesInformation from "../services-screen/hooks/useServicesInformation.hook";
import CardService from "../../components/shared/card-task/CardService";

import { useTranslation } from "react-i18next";
import { ActivityIndicator } from "react-native-paper";
import { RefreshControl } from "react-native-gesture-handler";

const HistoryScreen = () => {

    const { t } = useTranslation();

    const {
        user,
        servicesByStatus,
        isRefreshing,
        refreshServices,
        loadMoreServices,
        isLoading,
        hasMore
    } = useServicesInformation();

   
    const historyServices = [
        ...servicesByStatus.approved,
        ...servicesByStatus.rejected,
        ...servicesByStatus.completed,
        ...servicesByStatus.finished,
    ];

    return (
        <View style={styles.mainContainer}>
            <FlatList
                data={historyServices}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <CardService
                        key={item.id}
                        service={item}
                        hideButtons={true}
                    />
                )}
                refreshControl={
                    <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={refreshServices}
                    />
                  }
                  onEndReached={loadMoreServices}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={
                    isLoading && hasMore ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : null
                  }
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
});

export default HistoryScreen;
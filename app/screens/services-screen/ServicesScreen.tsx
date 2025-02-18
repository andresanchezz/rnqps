import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { TabBar, TabView } from "react-native-tab-view";
import { ActivityIndicator, Button, Text, FAB, TextInput } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { colors } from "../../../styles/colors";
import { typography } from "../../../styles/typography";
import CardService from "../../components/shared/card-task/CardService";
import useServicesInformation from "./hooks/useServicesInformation.hook";
import { TabRoute } from "../../interfaces/tab_route.interface";
import { Service, ServiceByStatusId, ServiceStatus } from "../../interfaces/services/services.interface";
import CustomButtonSheet from "../../components/shared/bottom-sheet/CustomButtonSheet";
import { buttonStyles } from "../../../styles/styles";

import moment from "moment";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";


const ServicesScreen = () => {

  const statusIdMap: Record<string, string | undefined> = {
    created: "1",
    pending: "2",
    approved: "3",
    rejected: "4",
    completed: "5",
    finished: "6",
    all: undefined,
  };

  const { t } = useTranslation();

  
  const {
    user,
    getServices,
    filteredServices,
    acceptBottomSheet,
    rejectBottomSheet,
    confirmBottomSheet,
    createBottomSheet,
    openBottomSheet,
    handleBottomSheetsActions,
    comment,
    setComment,
    setSelectedService,
    reassignBottomSheet,
    users,
    reassignService,
    selectedUser,
    setSelectedUser
  } = useServicesInformation();

  const [index, setIndex] = useState<number>(0);
  const [routes, setRoutes] = useState<TabRoute[]>([]);

  useEffect(() => {
    switch (user?.roleId) {
      case "1":
        setRoutes([
          { key: "pending", title: `${t("pending")}` },
          { key: "approved", title: `${t("approved")}` },
          { key: "all", title: `${t("all")}` },
        ]);
        break;
      case "2":
        setRoutes([
          { key: "pending", title: `${t("pending")}` },
          { key: "approved", title: `${t("approved")}` },
        ]);
        break;
      case "3":
        setRoutes([
          { key: "approved", title: `${t("approved")}` },
          { key: "all", title: `${t("all")}` },
        ]);
        break;
      case "4":
        setRoutes([
          { key: "pending", title: `${t("pending")}` },
          { key: "approved", title: `${t("approved")}` },
        ]);
        break;
      default:
        setRoutes([
          { key: "pending", title: `${t("pending")}` },
          { key: "approved", title: `${t("approved")}` },
        ]);
        break;
    }
  }, []);

  const handleIndexChange = async (newIndex: number) => {
    setIndex(newIndex);
    const routeKey = routes[newIndex].key as keyof ServiceByStatusId;
    const statusId = statusIdMap[routeKey];
  
    // Verifica si ya hay datos cargados para esta pestaña
    const currentData = filteredServices[routeKey].data;
    if (currentData.length === 0) {
      // Si no hay datos, solicita la primera página
      getServices(1, routeKey === 'all' ? undefined : statusId);
    }
  };

  const renderScene = ({ route }: { route: TabRoute }) => {

    let dataToShow = filteredServices?.all.data;

    switch (route.key) {
      case "created":
        dataToShow = filteredServices?.created.data
        break;
      case "pending":
        dataToShow = filteredServices?.pending.data
        break;
      case "approved":
        dataToShow = filteredServices?.approved.data
        break;
      case "rejected":
        dataToShow = filteredServices?.rejected.data
        break;
      case "completed":
        dataToShow = filteredServices?.completed.data
        break;
      case "finished":
        dataToShow = filteredServices?.finished.data
        break;
      case "all":
        dataToShow = filteredServices?.all.data
        break;
      default:
        dataToShow = [];
        break;

    }

    return (
      <View>

        {
          dataToShow.length > 0 ?
            <FlatList
              style={styles.flatList}
              data={dataToShow}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CardService service={item}
                  userRole={user.roleId}
                  currentView={route.key}
                  onAccept={() => {
                    setSelectedService(item)
                    openBottomSheet(acceptBottomSheet)
                  }}
                  onConfirm={() => {
                    setSelectedService(item)
                    openBottomSheet(confirmBottomSheet)
                  }}
                  onReject={() => {
                    setSelectedService(item)
                    openBottomSheet(rejectBottomSheet)
                  }}
                  onReassign={() => {
                    setSelectedService(item)
                    openBottomSheet(reassignBottomSheet)
                  }}
                />
              )}
              onEndReached={() => {
                const currentPage = filteredServices[route.key as keyof ServiceByStatusId].meta.page;
                getServices(currentPage + 1, route.key === 'all' ? undefined : statusIdMap[route.key]);
              }}
            />

            :

            <View style={styles.noMoreservicesBox}>
              <Text>{t("noMoreServices")}</Text>
            </View>

        }


      </View>
    );
  };

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
            onIndexChange={handleIndexChange}
            renderTabBar={renderTabBar}
        />
    </View>

  )

}

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
    marginVertical: 16,
  },
  inputSpacing: {
    height: 15,
  },
  timeButton: {
    borderRadius: 4,
  },
  flatList: {
    paddingVertical: 12,
  },
  flatListBox: {
    height: 250,
    paddingBottom: 25
  },
  noMoreservicesBox: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  item: {
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: '#f9c2ff', 
  },
  selectedItem: {
    backgroundColor: '#6e3b6e',
  },
});

export default ServicesScreen;
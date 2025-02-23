import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";

import DateTimePicker from '@react-native-community/datetimepicker';


import { useTranslation } from "react-i18next";



import useServicesInformation from "./hooks/useServicesInformation.hook";

import MyCustomBottomSheet from "../../components/shared/bottom-sheet/MyCustomBottomSheet";

import { colors } from "../../../styles/colors";

import { AcceptBottomSheet } from "../../components/services/AcceptBottomSheet";
import { RejecBottomSheet } from "../../components/services/RejecBottomSheet";
import { ConfirmBottomSheet } from "../../components/services/ConfirmBottomSheet";
import { CreateServiceBottomSheet } from "../../components/services/CreateServiceBottomSheet";
import { ReassignBottomSheet } from "../../components/shared/bottom-sheet/ReassignBottomSheet";
import { TabBar, TabView } from "react-native-tab-view";
import { TabRoute } from "../../interfaces/tab_route.interface";
import { Text } from "react-native-paper";
import { ServiceByStatusId } from "../../interfaces/services/services.interface";
import CardService from "../../components/shared/card-task/CardService";


const ServicesScreen = () => {

  const {
    user,

    acceptBottomSheet,
    rejectBottomSheet,
    confirmBottomSheet,
    createBottomSheet,
    reassignBottomSheet,
    openBottomSheet,

    statusIdMap,

    servicesByStatus,
    handleGetData,

    isLoading,
    isRefreshing,

    setSelectedService,
    selectedService,


  } = useServicesInformation();

  const { t } = useTranslation();

  //* DATE Y TIME PICKER 


  //* PULL REFRESH

  const handlePullRefresh = () => {

    const routeKey = routes[index].key as keyof ServiceByStatusId;
    const statusId = statusIdMap[routeKey];

    if (statusId) {
      handleGetData({ page: 1, statusId }, true)
    }

  }


  //* TABS ROUTES

  type Route = {
    key: string;
    title: string;
  };

  const [routes, setRoutes] = useState<Route[]>([]);
  const [index, setIndex] = useState<number>(0);

  const handleIndexChange = async (currentIndex: number) => {

    setIndex(currentIndex)

    const routeKey = routes[currentIndex].key as keyof ServiceByStatusId;
    const statusId = statusIdMap[routeKey];
    const currentData = servicesByStatus[routeKey].data;

    if (currentData.length === 0 && statusId) {

      handleGetData({ page: 1, statusId })

    }

  }

  const getTabRoutesByRole = (roleId: string): Route[] => {
    switch (roleId) {
      case "1":
        return [
          { key: "created", title: `${t("created")}` },
          { key: "pending", title: `${t("pending")}` },
          /* { key: "approved", title: `${t("approved")}` }, */
          /* { key: "all", title: `${t("all")}` }, */
        ];
      /*       case "2":
              return [
                { key: "pending", title: `${t("pending")}` },
                { key: "approved", title: `${t("approved")}` },
              ]; */
      case "3":
        return [
          { key: "created", title: `${t("created")}` },
          { key: "pending", title: `${t("pending")}` },
        ];
      case "4":
        return [
          { key: "pending", title: `${t("pending")}` },
          { key: "approved", title: `${t("approved")}` },
        ];
      default:
        return [
          { key: "pending", title: `${t("pending")}` },
          { key: "approved", title: `${t("approved")}` },
        ];
    }
  };

  const renderScene = ({ route }: { route: TabRoute }) => {

    let dataToShow = servicesByStatus?.[route.key as keyof typeof servicesByStatus]?.data || [];

    return (
      <View style={styles.mainContainer}>


        <FlatList
          data={dataToShow}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CardService
              service={item}
              userRole={user?.roleId}
              currentView={route.key}
              onAccept={() => {
                setSelectedService(item)
                openBottomSheet(acceptBottomSheet);
              }}
              onConfirm={() => {
                openBottomSheet(confirmBottomSheet);
              
              }}

              onReject={() => {
                openBottomSheet(rejectBottomSheet);
             
              }}

              onReassign={() => {
                openBottomSheet(reassignBottomSheet);

              }}
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
            const currentPage = servicesByStatus[route.key as keyof ServiceByStatusId]!.meta.page || 1;

              handleGetData({ page: currentPage + 1, statusId: statusIdMap[route.key as keyof typeof servicesByStatus]! })

          }}
        />





      </View>
    )

  }

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.light }}
      style={[{ backgroundColor: colors.secondary }]}
      labelStyle={{ color: colors.dark }}
    />
  );

  useEffect(() => {

    switch (user?.roleId) {
      case "1":
        handleGetData({ statusId: "1", page: 1 })
        break;
      case "3":
        handleGetData({ statusId: "1", page: 1 })
        break;
      case "4":
        handleGetData({ statusId: "2", page: 1 })
        break;

      default:
        break;
    }

    const routes = getTabRoutesByRole(user?.roleId || "");
    setRoutes(routes);

  }, []);


  return (

    <View style={styles.mainContainer}>


      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={handleIndexChange}
      />



      {/*Accept*/}
      <MyCustomBottomSheet ref={acceptBottomSheet} snapPoints={['10%', '25%']}>
        <AcceptBottomSheet />
      </MyCustomBottomSheet>

      {/*Reject*/}
      <MyCustomBottomSheet ref={rejectBottomSheet} snapPoints={['10%', '35%']}>
        <RejecBottomSheet />
      </MyCustomBottomSheet>

      {/*Confirm*/}
      <MyCustomBottomSheet ref={confirmBottomSheet} snapPoints={['10%', '25%']}>
        <ConfirmBottomSheet />
      </MyCustomBottomSheet>

      {/*Create service*/}
      <MyCustomBottomSheet ref={createBottomSheet} snapPoints={['50', '90']}>
        <CreateServiceBottomSheet />
      </MyCustomBottomSheet>

      {/*Reassign*/}
      <MyCustomBottomSheet ref={reassignBottomSheet} snapPoints={['20%', '45%']}>
        <ReassignBottomSheet />
      </MyCustomBottomSheet>


    </View>

  )

}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.light,
  },
});

export default ServicesScreen;
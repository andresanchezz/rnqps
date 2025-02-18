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
import MyCustomBottomSheet from "../../components/shared/bottom-sheet/MyCustomBottomSheet";
import { buttonStyles } from "../../../styles/styles";

import moment from "moment";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { ReassignBottomSheet } from "../../components/shared/bottom-sheet/ReassignBottomSheet";
import { AUser, User } from "../../interfaces/user/users";


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

  const handleSelectUser = (item: AUser) => {
    if (selectedUser?.id !== item?.id) {
      setSelectedUser(item);
    } else {
      setSelectedUser(null);
    }
  };

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
    setSelectedUser,

    isLoading
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
     if(user.roleId === "1"){
      getServices(1, routeKey === 'all' ? undefined : statusId);
     }else{
      getServices(1)
     }
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

      <View style={styles.mainContainer}>

        {
          dataToShow.length === 0 ? (
            isLoading ? (
              <View style={styles.mainContainerLoading}>
                <ActivityIndicator size="large" />
              </View>
            ) : (
              <View style={styles.noMoreservicesBox}>
                <Text>{t("noMoreServices")}</Text>
              </View>
            )
          ) : ((
            <FlatList
              style={styles.flatList}
              data={dataToShow}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CardService
                  service={item}
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
                const currentPage = filteredServices[route.key as keyof ServiceByStatusId]?.meta.page || 1;
                getServices(currentPage + 1, route.key === 'all' ? undefined : statusIdMap[route.key]);
              }}
              ListFooterComponent={

                <View style={styles.footer}>
                  {
                    isLoading 
                    ? <ActivityIndicator />
                    : <Text>{t("noMoreServices")}</Text>
                  }
                </View>

              }

            />
          )
          )
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


      {/*Accept*/}
      <MyCustomBottomSheet ref={acceptBottomSheet} snapPoints={['10%', '25%']}>
        <View>
          <Text style={styles.bottomSheetTitle}>{t("acceptService")}</Text>
          <Text style={styles.bottomSheetText}>{t("textAcceptService")}</Text>
          <TouchableOpacity onPress={() => { handleBottomSheetsActions('3') }} style={buttonStyles.button}>
            <Text style={buttonStyles.buttonText}>{t("confirm")}</Text>
          </TouchableOpacity>
        </View>
      </MyCustomBottomSheet>

      {/*Reject*/}
      <MyCustomBottomSheet ref={rejectBottomSheet} snapPoints={['10%', '35%']}>
        <View>
          <Text style={styles.bottomSheetTitle}>{t("rejectService")}</Text>
          <Text style={styles.bottomSheetText}>{t("textRejectService")}</Text>
          <TextInput mode="outlined" numberOfLines={8} value={comment} onChangeText={setComment} />
          <View style={styles.inputSpacing} />
          <TouchableOpacity onPress={() => { handleBottomSheetsActions('4') }} style={buttonStyles.button}>
            <Text style={buttonStyles.buttonText}>{t("confirm")}</Text>
          </TouchableOpacity>
        </View>
      </MyCustomBottomSheet>

      {/*Confirm*/}
      <MyCustomBottomSheet ref={confirmBottomSheet} snapPoints={['10%', '25%']}>
        <View>
          <Text style={styles.bottomSheetTitle}>{t("confirmService")}</Text>
          <Text style={styles.bottomSheetText}>{t("textConfirmService")}</Text>
          <TouchableOpacity onPress={() => { handleBottomSheetsActions('5') }} style={buttonStyles.button}>
            <Text style={buttonStyles.buttonText}>{t("confirm")}</Text>
          </TouchableOpacity>
        </View>
      </MyCustomBottomSheet>
      {/*Create service*/}

      {/*Reassign*/}
      <MyCustomBottomSheet ref={reassignBottomSheet} snapPoints={['20%', '45%']}>
        <View>
          <Text style={styles.bottomSheetTitle}>{t("reassignService")}</Text>
          <Text style={styles.bottomSheetText}>{t("textReassignService")}</Text>

          <FlatList
            style={styles.usersList}
            data={users?.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.usersListItem, selectedUser?.id === item?.id ? styles.userListItemSelected : ""]}
                onPress={() => {
                  handleSelectUser(item)
                }}>
                <Text
                  style={selectedUser?.id === item?.id ? { color: colors.light } : ""}
                >{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          <View style={styles.inputSpacing} />
          <TouchableOpacity onPress={reassignService} style={buttonStyles.button}>
            <Text style={buttonStyles.buttonText}>{t("confirm")}</Text>
          </TouchableOpacity>
        </View>
      </MyCustomBottomSheet>


    </View>






  )

}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.light,
  },
  mainContainerLoading: {
    flex: 1,
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center'

  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
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
  usersList: {
    borderTopColor: colors.dark,
    borderTopWidth: .5,
    height: 150,
    marginBottom: 10
  },
  usersListItem: {
    padding: 10
  },
  userListItemSelected: {
    backgroundColor: colors.primary,
  },
  footer: {
    marginTop: 15,
    marginBottom: 25,
    alignItems: 'center'
  }
});

export default ServicesScreen;
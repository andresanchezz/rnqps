import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { TabBar, TabView } from "react-native-tab-view";
import { ActivityIndicator, Button, Text, FAB, TextInput } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";
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
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";


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

    isLoading,
    createNewService,
    isDateSelected,
    isScheduleSelected,
    setIsDateSelected,
    setSchedule,
    setisScheduleSelected,
    setUnityNumber,
    setUnitySize,
    schedule,
    unitySize,
    unityNumber,
    setDate,
    options,
    setTypeId,
    setCommunityId,
    setExtraId,
    communityId,
    typeId,
    extraId,
    date,
  } = useServicesInformation();

  const { t } = useTranslation();


  //* DATE Y TIME PICKER 
  const onChangeTime = (event: any, selectedTime: Date | undefined) => {
    if (selectedTime) {
      setSchedule(selectedTime);
      setisScheduleSelected(true);
    }
  }

  const onChangeDate = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setIsDateSelected(true);
    }
  };

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: onChangeDate,
      mode: 'date',
      is24Hour: true,
      minimumDate: new Date(),
    });
  };

  const showTimePicker = () => {
    DateTimePickerAndroid.open({
      value: schedule,
      onChange: onChangeTime,
      mode: 'time',
      is24Hour: true,
    });
  };

  const handleSelectUser = (item: AUser) => {
    if (selectedUser?.id !== item?.id) {
      setSelectedUser(item);
    } else {
      setSelectedUser(null);
    }
  };


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
    const currentData = filteredServices[routeKey].data;

    if (currentData.length === 0) {
      if (user.roleId === "1" && statusId !== "all") {

        getServices(1, statusId)
      }
      if (user.roleId === "4") {
        getServices(1, statusId, user.id)
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
                const currentPage = filteredServices[route.key as keyof ServiceByStatusId]!.meta.page || 1;
                if(user.roleId === "1"){
                  getServices(currentPage + 1, statusIdMap[route.key]);
                }else{
                  getServices(currentPage + 1, statusIdMap[route.key], user.id);
                }
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
      <MyCustomBottomSheet ref={createBottomSheet} snapPoints={['50', '90']}>
        <View>
          <Text style={styles.bottomSheetTitle}>{t('createService')}</Text>
          <View style={{ height: 15 }}></View>
          <Button mode="outlined" onPress={showDatePicker} style={styles.timeButton}>
            <Text style={{ color: colors.dark }}>
              {isDateSelected
                ? `${t('selectedDate')} ${moment(date).format('MMMM D YYYY')}` // Formato: "enero 5 2025"
                : `${t('selectADate')}`}
            </Text>
          </Button>
          <View style={styles.inputSpacing} />
          <Button mode="outlined" onPress={showTimePicker} style={styles.timeButton}>
            <Text style={{ color: colors.dark }}>
              {isScheduleSelected
                ? `${t('selectedTime')} ${moment(schedule).format('hh:mm A')}` // Formato: "02:30 PM"
                : `${t('selectATime')}`}
            </Text>
          </Button>
          <View style={styles.inputSpacing} />
          <Dropdown
            mode="outlined"
            label={t('unitSize')}
            placeholder={t('selectUnitSize')}
            options={[
              { label: `1 ${t('bedroom')}`, value: "1 Bedroom" },
              { label: `2 ${t('bedroom')}`, value: "2 Bedroom" },
              { label: `3 ${t('bedroom')}`, value: "3 Bedroom" },
              { label: `4 ${t('bedroom')}`, value: "4 Bedroom" },
              { label: `5 ${t('bedroom')}`, value: "5 Bedroom" },
            ]}
            value={unitySize}
            onSelect={(value: string | undefined) => setUnitySize(value)}
          />
          <View style={styles.inputSpacing} />
          <TextInput
            mode="outlined"
            placeholder={t('unitNumber')}
            inputMode="numeric"
            value={unityNumber}
            onChangeText={(text) => setUnityNumber(text)}
          />
          <View style={styles.inputSpacing} />
          <Dropdown
            mode="outlined"
            label={t('community')}
            placeholder={t("selectCommunity")}
            options={options?.communities}
            value={communityId}
            onSelect={(value) => setCommunityId(value)}
          />
          <View style={styles.inputSpacing} />
          <Dropdown
            mode="outlined"
            label={t("type")}
            placeholder={t("selectType")}
            options={options?.cleaningTypes}
            value={typeId}
            onSelect={(value) => setTypeId(value)}
          />
          <View style={styles.inputSpacing} />
          <Dropdown
            mode="outlined"
            label="Extras"
            placeholder={t("selectExtras")}
            options={options?.extras}
            value={extraId}
            onSelect={(value) => setExtraId(value)}
          />
          <View style={styles.inputSpacing} />
          <TextInput
            mode="outlined"
            placeholder={t("comment")}
            numberOfLines={4}
            value={comment}
            onChangeText={(text) => setComment(text)}
          />
          <View style={styles.inputSpacing} />
          <TouchableOpacity onPress={() => createNewService()} style={buttonStyles.button}>
            <Text style={buttonStyles.buttonText}>{t("create")}</Text>
          </TouchableOpacity>
        </View>
      </MyCustomBottomSheet>

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


      {user?.roleId !== "4" && (
        <FAB
          style={styles.fab}
          icon="plus"
          color={colors.light}
          onPress={() => { openBottomSheet(createBottomSheet) }}
        />
      )}

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
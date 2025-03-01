import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import DateTimePicker from '@react-native-community/datetimepicker';

import { TabBar, TabView } from "react-native-tab-view";
import { ActivityIndicator, FAB, Text, TextInput } from "react-native-paper";
import { Dropdown, DropdownInput } from "react-native-paper-dropdown";

import { useTranslation } from "react-i18next";

import useServicesInformation from "./hooks/useServicesInformation.hook";

import { colors } from "../../../styles/colors";

import { ServiceByStatusId } from "../../interfaces/services/services.interface";
import { TabRoute } from "../../interfaces/tab_route.interface";

import MyCustomBottomSheet from "../../components/shared/bottom-sheet/MyCustomBottomSheet";
import CardService from "../../components/shared/card-task/CardService";
import { LoadingButton } from "../../components/LoadingButton";
import { FullScreenModal } from "../../components/shared/FullScreenModal";


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
    fetchDataToCreateModal,

    isRefreshing,

    handleBottomSheetsActions,
    comment,
    setComment,
    unitySize,
    setUnitySize,
    unityNumber,
    setUnityNumber,
    typeId,
    setTypeId,
    extraId,
    setExtraId,
    communityId,
    setCommunityId,
    filterCleaner,
    filteredCleanersList,
    filterQuery,

    date,
    setDate,
    schedule,
    setSchedule,
    options,
    selectedCleaner,
    setSelectedCleaner,

    reassignService,
    isLoading

  } = useServicesInformation();

  const { t } = useTranslation();

  //* DATE Y TIME PICKER 
  const [showDate, setShowDate] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);


  const toggleDatePicker = () => {
    setShowDate(!showDate);
  };

  const toggleSchedulePicker = () => {
    setShowSchedule(!showSchedule);
  };

  const onChangeDate = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setShowDate(false);
  };

  const onChangeSchedule = (event: any, selectedTime: Date | undefined) => {
    if (selectedTime) {
      setSchedule(selectedTime);
    }
    setShowSchedule(false);
  };

  // Formatear la fecha como "15 February 2023"
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Formatear la hora como "2:30 PM"
  const formattedTime = schedule.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  //* PULL REFRESH
  const handlePullRefresh = () => {
    const routeKey = routes[index].key as keyof ServiceByStatusId;
    const statusId = statusIdMap[routeKey];

    if (statusId) {
      handleGetData({ page: 1, statusId }, true);
    }
  };

  //* TABS ROUTES
  type Route = {
    key: string;
    title: string;
  };


  const [routes, setRoutes] = useState<Route[]>([]);
  const [index, setIndex] = useState<number>(0);

  const handleIndexChange = async (currentIndex: number) => {
    setIndex(currentIndex);

    const routeKey = routes[currentIndex].key as keyof ServiceByStatusId;
    const statusId = statusIdMap[routeKey];
    const currentData = servicesByStatus[routeKey].data;

    if (currentData.length === 0 && statusId) {
      handleGetData({ page: 1, statusId });
    }
  };

  const getTabRoutesByRole = (roleId: string): Route[] => {
    switch (roleId) {
      case "1":
        return [
          { key: "created", title: `${t("created")}` },
          { key: "pending", title: `${t("pending")}` },
        ];
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
                openBottomSheet(acceptBottomSheet, item);
              }}
              onConfirm={() => {
                openBottomSheet(confirmBottomSheet, item);
              }}
              onReject={() => {
                openBottomSheet(rejectBottomSheet, item);
              }}
              onReassign={() => {
                openBottomSheet(reassignBottomSheet, item);
              }}
            />
          )}
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
            handleGetData({ page: currentPage + 1, statusId: statusIdMap[route.key as keyof typeof servicesByStatus]! });
          }}
          ListFooterComponent={
            <View>

              {
                servicesByStatus[route.key as keyof ServiceByStatusId]?.meta.hasNextPage
                  ? isLoading
                    ? (
                      <View style={styles.footer}>
                        <ActivityIndicator size={30} />
                      </View>
                    )
                    : null
                  : (
                    <View style={styles.footer}>
                      <Text variant="bodyLarge" style={styles.textCenter}>{t("noMoreServices")}</Text>
                    </View>
                  )
              }

            </View>
          }
        />
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

  useEffect(() => {
    switch (user?.roleId) {
      case "1":
        handleGetData({ statusId: "1", page: 1 });
        fetchDataToCreateModal();
        break;
      case "3":
        handleGetData({ statusId: "1", page: 1 });
        fetchDataToCreateModal();

        break;
      case "4":
        handleGetData({ statusId: "2", page: 1 });
        break;
      default:
        break;
    }

    const routes = getTabRoutesByRole(user?.roleId || "");
    setRoutes(routes);
  }, [servicesByStatus, index]);

  const [xd, setXd] = useState(true);

  return (
    <View style={styles.mainContainer}>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={handleIndexChange}
      />

      {user.roleId !== "4" && (
        <View style={styles.fabContainer}>
          <FAB icon="plus" onPress={() => openBottomSheet(createBottomSheet)} />
        </View>
      )}

      {/*Create service*/}
      <MyCustomBottomSheet ref={createBottomSheet} snapPoints={['50%', '95%']}>
        <ScrollView style={styles.mainContainer}>
          <View style={styles.mainContainer}>
            <Text style={styles.buttonSheetText} variant="headlineSmall">{t('createService')}</Text>

            {/* Selector de fecha */}
            <Pressable onPress={toggleDatePicker}>
              <TextInput
                mode="outlined"
                placeholder={t("selectDate")}
                value={formattedDate}
                editable={false}
              />
            </Pressable>

            {showDate && (
              <DateTimePicker
                mode="date"
                display="spinner"
                value={date}
                onChange={onChangeDate}
                minimumDate={new Date()}
              />
            )}

            {/* Selector de hora */}
            <Pressable onPress={toggleSchedulePicker}>
              <TextInput
                mode="outlined"
                placeholder={t("selectTime")}
                value={formattedTime}
                editable={false}
              />
            </Pressable>

            {showSchedule && (
              <DateTimePicker
                mode="time"
                display="spinner"
                value={schedule}
                onChange={onChangeSchedule}
                minimumDate={new Date()}
              />
            )}


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
            <View />
            <TextInput
              mode="outlined"
              placeholder={t('unitNumber')}
              inputMode="numeric"
              value={unityNumber}
              onChangeText={(text) => setUnityNumber(text)}
            />
            <View />
            <Dropdown
              mode="outlined"
              label={t('community')}
              placeholder={t("selectCommunity")}
              options={options?.communities}
              value={communityId}
              onSelect={(value) => setCommunityId(value)}
            />
            <View />
            <Dropdown
              mode="outlined"
              label={t("type")}
              placeholder={t("selectType")}
              options={options?.cleaningTypes}
              value={typeId}
              onSelect={(value) => setTypeId(value)}
            />

            <View />
            <Dropdown
              mode="outlined"
              label="Extras"
              placeholder={t("selectExtras")}
              options={options?.extras}
              value={extraId}
              onSelect={(value) => setExtraId(value)}
            />
            <View />
            <TextInput
              mode="outlined"
              placeholder={t("comment")}
              numberOfLines={4}
              value={comment}
              onChangeText={(text) => setComment(text)}
            />
            <View />

          </View>
          <LoadingButton label={t("create")} onPress={() => { reassignService(reassignBottomSheet) }} />
        </ScrollView>
      </MyCustomBottomSheet>

      {/*Accept service*/}
      <MyCustomBottomSheet ref={acceptBottomSheet} snapPoints={['15%', '25%']}>

        <View style={{ flex: 1 }}>
          <Text style={styles.buttonSheetText} variant="headlineSmall">{t('acceptService')}</Text>
          <Text style={styles.buttonSheetText} variant="bodyMedium">{t('textAcceptService')}</Text>
        </View>

        <LoadingButton label="acceptService" onPress={() => { handleBottomSheetsActions('3', acceptBottomSheet) }} />

      </MyCustomBottomSheet>

      {/*Reject service*/}
      <MyCustomBottomSheet ref={rejectBottomSheet} snapPoints={['15%', '30%']}>

        <View style={{ flex: 1 }}>
          <Text style={styles.buttonSheetText} variant="headlineSmall">{t('rejectService')}</Text>
          <Text style={styles.buttonSheetText} variant="bodyMedium">{t('textRejectService')}</Text>

          <TextInput onChangeText={(text) => setComment(text)} mode="outlined"></TextInput>

        </View>

        <LoadingButton label="rejectService" onPress={() => { handleBottomSheetsActions('4', rejectBottomSheet) }} />

      </MyCustomBottomSheet>

      {/*Confirm service*/}
      <MyCustomBottomSheet ref={confirmBottomSheet} snapPoints={['15%', '20%']}>

        <View style={{ flex: 1 }}>
          <Text style={styles.buttonSheetText} variant="headlineSmall">{t('confirmService')}</Text>
          <Text style={styles.buttonSheetText} variant="bodyMedium">{t('textConfirmService')}</Text>
        </View>

        <LoadingButton label="confirmService" onPress={() => { handleBottomSheetsActions('5', confirmBottomSheet) }} />

      </MyCustomBottomSheet>

      {/*Reassign service*/}
      <MyCustomBottomSheet ref={reassignBottomSheet} snapPoints={['15%', '55%']}>
        <View style={{ flex: 1 }}>
          <Text style={styles.buttonSheetText} variant="headlineSmall">{t('reassignService')}</Text>
          <Text style={styles.buttonSheetText} variant="bodyMedium">{t('textReassignService')}</Text>

          <TextInput
            onChangeText={(value) => { filterCleaner(value) }}
            mode="outlined"
            label="Search"
            value={filterQuery}
          />

          <View style={styles.cleanersList}>
            <ScrollView>
              {filteredCleanersList?.map((cleaner) => (

                <TouchableOpacity
                  onPress={() => { setSelectedCleaner(cleaner) }}
                  style={[styles.cleanersListItem, selectedCleaner?.id === cleaner.id && styles.selectedCleaner]} key={cleaner.id}>

                  <Text variant="bodyMedium" style={selectedCleaner?.id === cleaner.id && { color: colors.light }}> {cleaner.name}</Text>
                </TouchableOpacity>

              ))}
            </ScrollView>
          </View>


        </View>

        <LoadingButton label="reassignService" onPress={() => { reassignService(reassignBottomSheet) }} />

      </MyCustomBottomSheet>



      {/* <FullScreenModal onClose={() => { setXd(false) }} visible={xd}>

              <TextInput></TextInput>

        <LoadingButton label="confirmService" onPress={() => { handleBottomSheetsActions('5', confirmBottomSheet) }} />
      </FullScreenModal> */}


    </View>

  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.light,
  },
  fabContainer: {
    position: "absolute",
    right: 16,
    bottom: 16,
    alignItems: "flex-end",
    gap: 16,
  },
  buttonSheetText: {
    textAlign: 'center',
    marginBottom: 8
  },
  cleanersList: {
    height: 220,
    marginVertical: 15
  },
  cleanersListCreate: {
    height: 120,
    marginVertical: 15
  },
  cleanersListItem: {
    padding: 8,
    marginVertical: 3,
  },
  selectedCleaner: {
    backgroundColor: colors.secondary
  },
  footer: {
    paddingVertical: 10
  },
  textCenter: {
    textAlign: 'center'
  }


});

export default ServicesScreen;
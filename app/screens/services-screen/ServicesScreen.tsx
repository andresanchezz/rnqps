import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, FlatList } from "react-native";
import { TabBar, TabView, Route } from "react-native-tab-view";

import { colors } from "../../../styles/colors";
import { typography } from "../../../styles/typography";
import { buttonStyles } from "../../../styles/styles";

import useServicesInformation from "./hooks/useServicesInformation.hook";

import CustomButtonSheet from "../../components/shared/bottom-sheet/CustomButtonSheet";
import CardService from "../../components/shared/card-task/CardService";

import { ActivityIndicator, Button, FAB, TextInput } from "react-native-paper";
import { Dropdown } from "react-native-paper-dropdown";

import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

import { useTranslation } from "react-i18next";

import moment from "moment";
import { RefreshControl } from "react-native-gesture-handler";

type TabRoute = Route & {
  key: string;
  title: string;
};

const ServicesScreen: React.FC = () => {
  const { t } = useTranslation();

  const {
    user,
    confirmBottomSheet,
    openConfirmSheet,
    openAcceptSheet,
    openDenySheet,
    handleUserSelectedAction,
    openCreateServicesSheet,
    servicesByStatus,
    setSelectedService,
    acceptBottomSheet,
    denyBottomSheet,
    comment,
    setComment,
    createBottomSheet,
    createNewService,
    unitySize,
    setUnitySize,
    unityNumber,
    setUnityNumber,
    schedule,
    setSchedule,
    isScheduleSelected,
    setisScheduleSelected,
    date,
    setDate,
    isDateSelected,
    setIsDateSelected,
    typeId,
    setTypeId,
    extraId,
    setExtraId,
    options,
    communityId,
    setCommunityId,
    isRefreshing,
    refreshServices,
    loadMoreServices,
    hasMore,
    isLoading

  } = useServicesInformation();

  const onChangeDate = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setIsDateSelected(true);
    }
  };

  const onChangeTime = (event: any, selectedTime: Date | undefined) => {
    if (selectedTime) {
      setSchedule(selectedTime);
      setisScheduleSelected(true);
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
  }, [user?.roleId, t]);

  const isCleaner = user?.roleId === "4";

  const renderScene = ({ route }: { route: TabRoute }) => {
    switch (route.key) {
      case "pending":
        return (
          <FlatList
            style={styles.flatList}
            data={servicesByStatus.pending}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CardService
                service={item}
                onAccept={isCleaner ? () => {
                  setSelectedService(item);
                  openAcceptSheet();
                } : undefined}
                onDeny={isCleaner ? () => {
                  setSelectedService(item);
                  openDenySheet();
                } : undefined}
                hideButtons={!isCleaner}
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
        );
      case "approved":
        return (
          <FlatList
            style={styles.flatList}
            data={servicesByStatus.approved}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CardService
                service={item}
                onConfirm={isCleaner ? () => {
                  setSelectedService(item);
                  openConfirmSheet();
                } : undefined}

                hideButtons={!isCleaner}

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
        );
      case "all":
        return (
          <FlatList
            style={styles.flatList}
            data={servicesByStatus.all.data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CardService
                service={item}
                hideButtons
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
        );
      default:
        return null;
    }
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
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
      />

      {user?.roleId !== "4" && (
        <FAB
          style={styles.fab}
          icon="plus"
          color={colors.light}
          onPress={openCreateServicesSheet}
        />
      )}

      {/* Modal para aceptar un servicio */}
      <CustomButtonSheet ref={acceptBottomSheet} snapPoints={['10%', '25%']}>
        <View style={styles.form}>
          <Text style={styles.bottomSheetTitle}>{t("acceptService")}</Text>
          <Text style={styles.bottomSheetText}>{t("textAcceptService")}</Text>
          <TouchableOpacity onPress={() => { handleUserSelectedAction('3') }} style={buttonStyles.button}>
            <Text style={buttonStyles.buttonText}>{t("confirm")}</Text>
          </TouchableOpacity>
        </View>
      </CustomButtonSheet>

      {/* Modal para rechazar un servicio */}
      <CustomButtonSheet ref={denyBottomSheet} snapPoints={['10%', '35%']}>
        <View style={styles.form}>
          <Text style={styles.bottomSheetTitle}>{t("denyService")}</Text>
          <Text style={styles.bottomSheetText}>{t("textDenyService")}</Text>
          <TextInput mode="outlined" numberOfLines={8} value={comment} onChangeText={setComment} />
          <View style={styles.inputSpacing} />
          <TouchableOpacity onPress={() => { handleUserSelectedAction('4') }} style={buttonStyles.button}>
            <Text style={buttonStyles.buttonText}>{t("confirm")}</Text>
          </TouchableOpacity>
        </View>
      </CustomButtonSheet>

      {/* Confirmar servicio */}
      <CustomButtonSheet ref={confirmBottomSheet} snapPoints={['10%', '25%']}>
        <View style={styles.form}>
          <Text style={styles.bottomSheetTitle}>{t("confirmService")}</Text>
          <Text style={styles.bottomSheetText}>{t("textConfirmService")}</Text>
          <TouchableOpacity onPress={() => { handleUserSelectedAction('5') }} style={buttonStyles.button}>
            <Text style={buttonStyles.buttonText}>{t("confirm")}</Text>
          </TouchableOpacity>
        </View>
      </CustomButtonSheet>

      {/* Modal para crear un servicio */}
      <CustomButtonSheet ref={createBottomSheet} snapPoints={['50', '90']}>
        <View style={styles.form}>
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
      </CustomButtonSheet>

    </View>
  );
};

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
    borderRadius: 4
  },
  flatList: {
    paddingVertical: 12,
  }
});

export default ServicesScreen;
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
import { Service, FilteredServices } from "../../interfaces/services/services.interface";
import CustomButtonSheet from "../../components/shared/bottom-sheet/CustomButtonSheet";
import { buttonStyles } from "../../../styles/styles";

import moment from "moment";


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

  const { user, getServices, allServices, acceptBottomSheet, rejectBottomSheet, confirmBottomSheet, createBottomSheet, openBottomSheet, handleBottomSheetsActions, comment, setComment, setSelectedService } = useServicesInformation();

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
    const routeKey = routes[newIndex].key;
    const statusId = statusIdMap[routeKey];

    if (user?.roleId === "1") {
      getServices("1", routeKey === "all" ? undefined : statusId);
    } else {
      getServices("1");
    }
  };

  const renderScene = ({ route }: { route: TabRoute }) => {

    let dataToShow: Service[] = allServices;

    if (user?.roleId === "1") {
      dataToShow
    } else {
      switch (route.key) {
        case "pending":
          dataToShow = allServices.filter((service) => service.status.id === "2");
          break;
        case "approved":
          dataToShow = allServices.filter((service) => service.status.id === "3");
          break;
        case "rejected":
          dataToShow = allServices.filter((service) => service.status.id === "4");
          break;
        case "completed":
          dataToShow = allServices.filter((service) => service.status.id === "5");
          break;
        case "finished":
          dataToShow = allServices.filter((service) => service.status.id === "6");
          break;
        case "all":
          dataToShow = allServices; // Mostrar todos los servicios
          break;
        default:
          dataToShow = [];
          break;
      }
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
                />
              )}
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


      {user?.roleId !== "4" && (
        <FAB
          style={styles.fab}
          icon="plus"
          color={colors.light}
          onPress={() => { }}
        />
      )}




      {/* Modal para aceptar un servicio */}
      <CustomButtonSheet ref={acceptBottomSheet} snapPoints={['10%', '25%']}>
        <View style={styles.form}>
          <Text style={styles.bottomSheetTitle}>{t("acceptService")}</Text>
          <Text style={styles.bottomSheetText}>{t("textAcceptService")}</Text>
          <TouchableOpacity onPress={() => { handleBottomSheetsActions('3') }} style={buttonStyles.button}>
            <Text style={buttonStyles.buttonText}>{t("confirm")}</Text>
          </TouchableOpacity>
        </View>
      </CustomButtonSheet>

      {/* Modal para rechazar un servicio */}
      <CustomButtonSheet ref={rejectBottomSheet} snapPoints={['10%', '35%']}>
        <View style={styles.form}>
          <Text style={styles.bottomSheetTitle}>{t("rejectService")}</Text>
          <Text style={styles.bottomSheetText}>{t("textRejectService")}</Text>
          <TextInput mode="outlined" numberOfLines={8} value={comment} onChangeText={setComment} />
          <View style={styles.inputSpacing} />
          <TouchableOpacity onPress={() => { handleBottomSheetsActions('4') }} style={buttonStyles.button}>
            <Text style={buttonStyles.buttonText}>{t("confirm")}</Text>
          </TouchableOpacity>
        </View>
      </CustomButtonSheet>

      {/* Confirmar servicio */}
      <CustomButtonSheet ref={confirmBottomSheet} snapPoints={['10%', '25%']}>
        <View style={styles.form}>
          <Text style={styles.bottomSheetTitle}>{t("confirmService")}</Text>
          <Text style={styles.bottomSheetText}>{t("textConfirmService")}</Text>
          <TouchableOpacity onPress={() => { handleBottomSheetsActions('5') }} style={buttonStyles.button}>
            <Text style={buttonStyles.buttonText}>{t("confirm")}</Text>
          </TouchableOpacity>
        </View>
      </CustomButtonSheet>

      {/* Modal para crear un servicio */}
      {/* <CustomButtonSheet ref={createBottomSheet} snapPoints={['50', '90']}>
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
      </CustomButtonSheet> */}




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
  noMoreservicesBox: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ServicesScreen;
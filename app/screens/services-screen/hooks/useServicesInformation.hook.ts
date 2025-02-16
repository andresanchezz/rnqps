import { RefObject, useEffect, useRef, useState } from 'react';

import * as Sentry from "@sentry/react-native";

import * as SecureStore from 'expo-secure-store';

import moment from 'moment';

import Toast from 'react-native-toast-message';

import { apiServicesQPS } from '../../../api/services-qps';
import { Service, Services, ServiceByStatusId, FilteredServices } from '../../../interfaces/services/services.interface';
import { CommunitiesByManager } from '../../../interfaces/services/communities';
import { Extras } from '../../../interfaces/services/extras';
import { CleaningTypes } from '../../../interfaces/services/types';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useTranslation } from 'react-i18next';

interface Option {
  label: string;
  value: string;
}

const useServicesInformation = () => {

  const userString = SecureStore.getItem('userData');
  const user = userString ? JSON.parse(userString) : null;

  const [date, setDate] = useState(moment().toDate());
  const [schedule, setSchedule] = useState(moment().toDate());
  const [isDateSelected, setIsDateSelected] = useState<boolean>(false);
  const [isScheduleSelected, setisScheduleSelected] = useState<boolean>(false);
  const [unitySize, setUnitySize] = useState<string>();
  const [unityNumber, setUnityNumber] = useState<string>();
  const [comment, setComment] = useState<string>();
  const [communityId, setCommunityId] = useState<string>();
  const [typeId, setTypeId] = useState<string>();
  const [extraId, setExtraId] = useState<string>();

  const [selectedService, setSelectedService] = useState<Service>();

  const [allServices, setAllServices] = useState<Service[]>([]);


  const createBottomSheet = useRef<BottomSheetMethods>(null);
  const acceptBottomSheet = useRef<BottomSheetMethods>(null);
  const rejectBottomSheet = useRef<BottomSheetMethods>(null);
  const confirmBottomSheet = useRef<BottomSheetMethods>(null);

  const [options, setOptions] = useState<{ communities: Option[], extras: Option[], cleaningTypes: Option[] }>({
    communities: [],
    cleaningTypes: [],
    extras: [],
  });

  const {t} = useTranslation()

  const getCommunitiesByManager = async () => {
    try {
      const { data } = await apiServicesQPS.get<CommunitiesByManager[]>(`/communities/by-manager/${user.id}`);
      return data.map(community => community.id);
    } catch (error: any) {
      console.error('Error fetching communities:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const getServices = async (page: string, statusId?: string) => {

    /* setAllServices() */

    let url = '/services';
    let options: any = {};
    let method = 'GET';

    switch (user?.roleId) {
      case "1":

        if (statusId) {
          url = `/services/by-status/${statusId}?page=${page}`
        } else {
          url = `/services?page=${page}`
        }
        break;
      case "2":

        break;
      case "3":
        url = '/services/by-communities?take=35';
        method = 'POST';
        options = {
          data: { communities: await getCommunitiesByManager() },
        };
        break;
      case "4":
        url = `/services/by-cleaner/${user.id}?take=35`;
        method = 'POST';
        break;
      default:
        break;

    }


    const { data } = await apiServicesQPS<Services>(url, { method, ...options });

    setAllServices(data.data)


  };

  const handleBottomSheetsActions = async (newStatus: string) => {
    if (!selectedService) {
      return;
    }

    if (newStatus === "5") {
      const now = moment();

      const selectedDate = moment(selectedService.date, 'YYYY-MM-DD');

      const scheduleTime = moment(selectedService.schedule, 'HH:mm');

      const selectedDateTime = selectedDate.set({
        hour: scheduleTime.hour(),
        minute: scheduleTime.minute()
      });

      if (now.isBefore(selectedDateTime)) {
        Toast.show({
          type: 'error',
          text1: `${t("confirm")}`,
          text2: `${t("confirmOnDateError")}`
        });
        return;
      }
    }

    if (newStatus === "4" && !comment) {
      Toast.show({
        type: 'error',
        text1: `${t("reject")}`,
        text2: `${t("confirmOnRejectError")}`
      });
      return;
    }

    const updatedData = {
      date: selectedService.date,
      schedule: selectedService.schedule,
      comment: selectedService.comment,
      userComment: newStatus === "4" ? comment : selectedService.userComment,
      unitySize: selectedService.unitySize,
      unitNumber: selectedService.unitNumber,
      communityId: selectedService.communityId,
      typeId: selectedService.typeId,
      statusId: newStatus,
      userId: selectedService.userId,
    };

    try {

      await apiServicesQPS.patch(`/services/${selectedService.id}`, updatedData);

      acceptBottomSheet.current?.close();
      rejectBottomSheet.current?.close();
      confirmBottomSheet.current?.close(); 
    } catch (error) {
      console.log(error);
      Sentry.captureException(error);
    }
  };


  //* BOTTOMSHEETS

  const openBottomSheet = (bottomSheetRef: React.RefObject<BottomSheetMethods>) => {
    bottomSheetRef.current?.expand();
  };

  useEffect(() => {
   getServices("1");
  }, []);

  return {
    user,

    schedule,
    setSchedule,
    isScheduleSelected,
    setisScheduleSelected,

    date,
    setDate,

    isDateSelected,
    setIsDateSelected,

    comment,
    setComment,

    unitySize,
    setUnitySize,

    unityNumber,
    setUnityNumber,

    communityId,
    setCommunityId,

    typeId,
    setTypeId,

    extraId,
    setExtraId,

    setSelectedService,
    getServices,

    options,
    allServices,

    acceptBottomSheet,
    rejectBottomSheet,
    confirmBottomSheet,
    createBottomSheet,
    openBottomSheet,

    handleBottomSheetsActions
  };
};

export default useServicesInformation;
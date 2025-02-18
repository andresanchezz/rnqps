import { useEffect, useRef, useState } from 'react';

import * as Sentry from "@sentry/react-native";

import * as SecureStore from 'expo-secure-store';

import moment from 'moment';

import Toast from 'react-native-toast-message';

import { apiServicesQPS } from '../../../api/services-qps';

import { Service, Services, ServiceByStatusId, ServiceStatus } from '../../../interfaces/services/services.interface';
import { AUser, User } from '../../../interfaces/user/users';
import { UserById } from '../../../interfaces/user/userById';

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
  const user: UserById = userString ? JSON.parse(userString) : null;

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
  const [selectedUser, setSelectedUser] = useState<AUser>();

  const [users, setUsers] = useState<User>();


  const [filteredServices, setFilteredServices] = useState<ServiceByStatusId>({
    all: { data: [], meta: { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 } },
    created: { data: [], meta: { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 } },
    pending: { data: [], meta: { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 } },
    approved: { data: [], meta: { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 } },
    rejected: { data: [], meta: { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 } },
    completed: { data: [], meta: { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 } },
    finished: { data: [], meta: { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 } },
  });

  const createBottomSheet = useRef<BottomSheetMethods>(null);
  const acceptBottomSheet = useRef<BottomSheetMethods>(null);
  const rejectBottomSheet = useRef<BottomSheetMethods>(null);
  const confirmBottomSheet = useRef<BottomSheetMethods>(null);
  const reassignBottomSheet = useRef<BottomSheetMethods>(null);

  const [options, setOptions] = useState<{ communities: Option[], extras: Option[], cleaningTypes: Option[] }>({
    communities: [],
    cleaningTypes: [],
    extras: [],
  });

  const { t } = useTranslation();

  const mapStatusByNumber = (statusString: string): ServiceStatus => {
    const statusNumber = parseInt(statusString);
    const statusMap: { [key: number]: ServiceStatus } = {
      1: 'created',
      2: 'pending',
      3: 'approved',
      4: 'rejected',
      5: 'completed',
      6: 'finished',
    };
    return statusMap[statusNumber] || 'created';
  }

  const getServices = async (page: number, statusId?: string) => {
    console.log(page, statusId);
    let url = '/services';
    let options: any = {};
    let method = 'GET';
    let filter: ServiceStatus;
  
    if (statusId) {
      filter = mapStatusByNumber(statusId);
      // Evita solicitar la misma página o una página que no exista
      if (
        !filteredServices[filter].meta.hasNextPage || // No hay más páginas
        page > filteredServices[filter].meta.pageCount || // Página fuera de rango
        page === filteredServices[filter].meta.page // Página ya solicitada
      ) {
        return;
      }
    } else {
      // Lógica similar para el caso sin statusId (all)
      if (
        !filteredServices.all.meta.hasNextPage ||
        page > filteredServices.all.meta.pageCount ||
        page === filteredServices.all.meta.page
      ) {
        return;
      }
    }
  
    if (statusId) {
      switch (user.roleId) {
        case '1': // Super_admin
          url = `/services/by-status/${statusId}?page=${page}
          `;
          break;
        // Otros casos...
      }
    } else {
      switch (user.roleId) {
        case '1':
          url = `/services?page=${page}`;
          break;
        // Otros casos...
      }
    }
  
    try {

      const { data } = await apiServicesQPS<Services>(url, { method, ...options });
  
      setFilteredServices((prevState) => {
        const updatedData = {
          data: [...prevState[filter || 'all'].data, ...data.data], 
          meta: data.meta, 
        };
  
        return {
          ...prevState,
          [filter || 'all']: updatedData, 
        };
      });

    } catch (error) {
      console.error('Error fetching services:', error);
      Sentry.captureException(error);
    }
  };


  const getUsers = async (page: number = 1, take: number = 10) => {
    try {
      const { data } = await apiServicesQPS.get<User>(`/users?page=${page}&take=${take}`);
      setUsers(data)
    } catch (error) {
      console.log(error)
    }
  }

  const reassignService = () => {

  }

  const getCommunitiesByManager = async () => {
    try {
      const { data } = await apiServicesQPS.get<CommunitiesByManager[]>(`/communities/by-manager/${user.id}`);
      return data.map(community => community.id);
    } catch (error: any) {
      console.error('Error fetching communities:', error.response?.data?.message || error.message);
      throw error;
    }
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
    getUsers();
    getServices(1);
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
    filteredServices,

    acceptBottomSheet,
    rejectBottomSheet,
    confirmBottomSheet,
    createBottomSheet,
    reassignBottomSheet,
    openBottomSheet,

    handleBottomSheetsActions,
    users,
    reassignService,
    selectedUser,
    setSelectedUser
  };
};

export default useServicesInformation;
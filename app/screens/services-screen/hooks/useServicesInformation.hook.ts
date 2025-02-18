import { useEffect, useRef, useState } from 'react';

import * as Sentry from "@sentry/react-native";

import * as SecureStore from 'expo-secure-store';

import moment from 'moment';

import Toast from 'react-native-toast-message';

import { apiServicesQPS } from '../../../api/services-qps';

import { Service, Services, ServiceByStatusId, ServiceStatus } from '../../../interfaces/services/services.interface';
import { AUser, User } from '../../../interfaces/user/users';
import { UserById } from '../../../interfaces/user/userById';

import { Communities } from '../../../interfaces/services/communities';
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
  const [selectedUser, setSelectedUser] = useState<AUser | null>();

  const [users, setUsers] = useState<User>();

  const [isLoading, setIsLoading] = useState<boolean>(false);


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
    setIsLoading(true);
    console.log(page, statusId)
    let url = '/services';
    let options: any = {};
    let method = 'GET';
    let filter: ServiceStatus;
  
    if (statusId) {
      filter = mapStatusByNumber(statusId);
      if (
        !filteredServices[filter].meta.hasNextPage ||
        page > filteredServices[filter].meta.pageCount ||
        page === filteredServices[filter].meta.page
      ) {
        setIsLoading(false);
        return;
      }
    } else {
      if (
        !filteredServices.all.meta.hasNextPage ||
        page > filteredServices.all.meta.pageCount ||
        page === filteredServices.all.meta.page
      ) {
        setIsLoading(false);
        return;
      }
    }
  
    if (statusId) {
      switch (user.roleId) {
        case '1':
          url = `/services/by-status/${statusId}?page=${page}`;
          break;
      }
    } else {
      switch (user.roleId) {
        case '1':
          url = `/services?page=${page}`;
          break;
        case '3':
          url = '/services/by-communities?take=50';
          options = await getCommunitiesByManager();
          method = 'POST';
          break;
        case '4':
          url = `/services/by-cleaner/${user.id}?page=${page}&take=50`;
          method = 'POST';
          break;
      }
    }
  
    try {
      const { data } = await apiServicesQPS<Services>(url, { method, ...options });
  console.log(data)

      setFilteredServices((prevState) => {
        const updatedState = { ...prevState };
  
        if (!statusId) {
          updatedState.all.data = [...updatedState.all.data, ...data.data];
          updatedState.all.meta = data.meta;
        }

        data.data.forEach((service) => {
          switch (service.statusId) {
            case '1': 
              updatedState.created.data.push(service);
              if (statusId === '1') updatedState.created.meta = data.meta; // Actualizar meta solo si es el filtro actual
              break;
            case '2': // PENDING
              updatedState.pending.data.push(service);
              if (statusId === '2') updatedState.pending.meta = data.meta; // Actualizar meta solo si es el filtro actual
              break;
            case '3': // APPROVED
              updatedState.approved.data.push(service);
              if (statusId === '3') updatedState.approved.meta = data.meta; // Actualizar meta solo si es el filtro actual
              break;
            case '4': // REJECTED
              updatedState.rejected.data.push(service);
              if (statusId === '4') updatedState.rejected.meta = data.meta; // Actualizar meta solo si es el filtro actual
              break;
            case '5': // COMPLETED
              updatedState.completed.data.push(service);
              if (statusId === '5') updatedState.completed.meta = data.meta; // Actualizar meta solo si es el filtro actual
              break;
            case '6': // FINISHED
              updatedState.finished.data.push(service);
              if (statusId === '6') updatedState.finished.meta = data.meta; // Actualizar meta solo si es el filtro actual
              break;
            default:
              break;
          }
        });
  
        return updatedState;
      });
  
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
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

  const getCommunitiesByManager = async () => {
    try {
      const { data } = await apiServicesQPS.get<Communities[]>(`/communities/by-manager/${user.id}`);
      return data.map(community => community.id);
    } catch (error: any) {
      console.error('Error fetching communities:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const reassignService = async () => {
    if (!selectedService || !selectedUser) {
      console.log('hola')
      return;
    }

    const updatedData = {
      date: selectedService.date,
      schedule: selectedService.schedule,
      comment: selectedService.comment,
      userComment: selectedService?.userComment,
      unitySize: selectedService.unitySize,
      unitNumber: selectedService.unitNumber,
      communityId: selectedService.communityId,
      typeId: selectedService.typeId,
      statusId: selectedService?.statusId,
      userId: selectedUser.id,
    };


    await apiServicesQPS.patch(`/services/${selectedService.id}`, updatedData);

    acceptBottomSheet.current?.close();
    rejectBottomSheet.current?.close();
    confirmBottomSheet.current?.close();
    reassignBottomSheet.current?.close();

  }

  //* BOTTOMSHEETS
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

  const openBottomSheet = (bottomSheetRef: React.RefObject<BottomSheetMethods>) => {
    bottomSheetRef.current?.expand();
  };

  //** Create service
  const createNewService = async () => {

    const newService = {

      date,
      schedule,
      comment,
      userComment: '',
      unitySize,
      unitNumber: unityNumber,
      communityId,
      typeId,
      statusId: '1',
      extraId,

    };

    try {
      await apiServicesQPS.post('/services', newService);

    } catch (error: any) {
      console.log(error);
      Sentry.captureMessage(error);
    }
    createBottomSheet.current?.close();
  };

  const getExtrasList = async () => {
    let data;
    try {
      data = (await apiServicesQPS.get<Extras>('/extras')).data;
    } catch (error: any) {
      console.log(error);
      Sentry.captureMessage(error);
    }
    return data;
  };

  const getTypesList = async () => {
    let data;
    try {
      data = (await apiServicesQPS.get<CleaningTypes>('/types')).data;
    } catch (error: any) {
      Sentry.captureMessage(error);
    }
    return data;
  };

  const getCommunitiesList = async () => {
    let data;
    try {
      data = (await apiServicesQPS.get<Communities[]>(`/communities/by-manager/${user?.id}`)).data;
      return data
    } catch (error: any) {
      Sentry.captureMessage(error);
      return [];
    } finally {

    }
  };

  const fetchDataToCreateModal = async () => {

    const typesList = await getTypesList();
    const communitiesList = await getCommunitiesList();
    const extrasList = await getExtrasList();

    let cleaningTypeOptions: Option[] = [];
    let communityOptions: Option[] = [];
    let extrasOptions: Option[] = [];

    if (typesList) {
      cleaningTypeOptions = typesList.data.map((type) => ({
        label: type.cleaningType,
        value: type.id,
      }));
    }

    if (communitiesList) {
      cleaningTypeOptions  = communitiesList.map((community) => ({
          label: community.communityName,
          value: community.id,
        }))
    }

    if (extrasList) {
      extrasOptions = extrasList.data.map((extra) => ({
        label: extra.item,
        value: extra.id,
      }));
    }

    setOptions({ communities: communityOptions, extras: extrasOptions, cleaningTypes: cleaningTypeOptions });

  }; 


  useEffect(() => {

    if (user.roleId === "1") {
      getServices(1, "2");
    } else {
      getServices(1)
    }

    if (user.roleId !== "4") {
      getUsers()
    }

    getCommunitiesList()

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
    setSelectedUser,
    isLoading
  };
};

export default useServicesInformation;
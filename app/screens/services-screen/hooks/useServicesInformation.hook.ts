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

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

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

  const getServices = async (page: number, statusId?: string, userId?: string, isRefreshing?: boolean) => {


    if (isLoading) {
      return
    }

    if (isRefreshing) {
      setIsRefreshing(true)
    }

    setIsLoading(true);

    if (isRefreshing && statusId) {
      const filter = mapStatusByNumber(statusId);
      filteredServices[filter].data = []
      filteredServices[filter].meta = { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 }
    }

    if (isRefreshing && !statusId) {
      filteredServices.all.data = []
      filteredServices.all.meta = { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 }
    }


    let url = '';
    let filter: ServiceStatus;

    url = userId
      ? `/services/by-user/${userId}/${statusId}?page=${page}`
      : statusId
        ? `/services/by-status/${statusId}?page=${page}`
        : `/services?page=${page}`;


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
        {
          setIsLoading(false);
          return;
        }
      }
    }


    try {

      const { data } = await apiServicesQPS<Services>(url);

      if (statusId) {
        setFilteredServices(filterServices(data, statusId));
      } else {
        setFilteredServices(prevState => ({
          ...prevState,
          all: {
            data: [...prevState.all.data, ...data.data],
            meta: data.meta,
          },
        }));
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      Sentry.captureException(error);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }

  };

  const getCleanerServices = async () => {
    try {
      const { data } = await apiServicesQPS.post(`/services/by-cleaner/${user.id}?take=50`);

        

    } catch (error) {
      console.log('error')
    }

  }

  const getManagerServices = async () => {

    const communities = await getCommunitiesByManager();
    try {

      const { data } = await apiServicesQPS.post('/services/by-communities?take=50', {communities});

      data.data.forEach((service:Service) => {

        filteredServices.all.data.push(service);

        switch (service.statusId) {
            case 'created':
              filteredServices.created.data.push(service);
                break;
            case 'pending':
              filteredServices.pending.data.push(service);
                break;
            case 'approved':
              filteredServices.approved.data.push(service);
                break;
            case 'rejected':
              filteredServices.rejected.data.push(service);
                break;
            case 'completed':
              filteredServices.completed.data.push(service);
                break;
            case 'finished':
              filteredServices.finished.data.push(service);
                break;
            default:
                // Si el statusId no coincide con ninguno de los anteriores, no hacemos nada
                break;
        }
    });


    } catch (error) {
      console.log(error)
    }

  }

  const filterServices = (data: Services, statusId: string) => {
    return (prevState: ServiceByStatusId) => {
      const updatedState = { ...prevState };

      const filter = mapStatusByNumber(statusId);

      updatedState[filter].data = [...updatedState[filter].data, ...data.data];
      updatedState[filter].meta = data.meta;

      return updatedState;
    };
  };

  const getUsers = async (page: number = 1) => {
    try {
      const { data } = await apiServicesQPS.get<User>(`/users?page=${page}`);
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

      const data = await apiServicesQPS.post('/services', newService);

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
      communityOptions = communitiesList.map((community) => (
        {
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
    console.log(communityOptions)
  };


  useEffect(() => {

    if (user.roleId === "1") {
      getServices(1, "2");
    } else {
      getServices(1, "2", user.id);
    }

    if (user.roleId !== "4") {
      fetchDataToCreateModal();
      getUsers();
    }

    if (user.roleId === "4") {
      getCleanerServices();
    }
    if (user.roleId === "3") {
      getManagerServices();
    }

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
    isLoading,
    createNewService,

    isRefreshing,
    setIsRefreshing,
    getCleanerServices,
    getManagerServices

  };
};

export default useServicesInformation;
import { useEffect, useRef, useState } from 'react';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { apiServicesQPS } from '../../../api/services-qps';
import { DataService, Service, ServiceByStatusId, ServiceStatus } from '../../../interfaces/services/services.interface';
import * as secureStore from 'expo-secure-store';
import { Cleaner, DataCleaner } from '../../../interfaces/user/userById';
import { Extras } from '../../../interfaces/services/extras';
import { CleaningTypes, Type } from '../../../interfaces/services/types';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { Communities, Community } from '../../../interfaces/services/communities';

const useServicesInformation = () => {
  const userString = secureStore.getItem('userData');
  const user: DataCleaner = userString ? JSON.parse(userString) : null;

  //* Service(s)
  const [servicesByStatus, setServicesByStatus] = useState<ServiceByStatusId>({
    created: { data: [], meta: { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 } },
    pending: { data: [], meta: { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 } },
    approved: { data: [], meta: { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 } },
    rejected: { data: [], meta: { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 } },
    completed: { data: [], meta: { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 } },
    finished: { data: [], meta: { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 } },
  });
  const [selectedService, setSelectedService] = useState<DataService | null>(null);

  const { t } = useTranslation();

  //* CREATE SERVICE / REJECT SERVICE

  const [comment, setComment] = useState<string>();
  const [unitySize, setUnitySize] = useState<string>();
  const [unityNumber, setUnityNumber] = useState<string>();
  const [typeId, setTypeId] = useState<string>();
  const [extraId, setExtraId] = useState<string>();
  const [communityId, setCommunityId] = useState<string>();

  const [date, setDate] = useState(new Date());
  const [isDateSelected, setIsDateSelected] = useState(false);

  const [schedule, setSchedule] = useState(new Date());
  const [isScheduleSelected, setIsScheduleSelected] = useState(false);

  //* CLEANERS LIST

  const [cleanersList, setCleanersList] = useState<DataCleaner[]>([]);
  const [filteredCleanersList, setFilteredCleanersList] = useState<DataCleaner[]>([]);
  const [filterQuery, setFilterquery] = useState<string>('');
  const [selectedCleaner, setSelectedCleaner] = useState<DataCleaner | null>();

  //* Statuses (LIFE CICLE NO QPS DATA)

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  //* BOTTOM SHEETS
  const [isFullScreenVisible, setIsFullScreenVisible] = useState(false);
  const acceptBottomSheet = useRef<BottomSheetMethods>(null);
  const rejectBottomSheet = useRef<BottomSheetMethods>(null);
  const confirmBottomSheet = useRef<BottomSheetMethods>(null);
  const reassignBottomSheet = useRef<BottomSheetMethods>(null);

  //* OPTIONS

  interface Option {
    label: string;
    value: string;
  }

  const [options, setOptions] = useState<{ communities: Option[], extras: Option[] }>({
    communities: [],
    extras: [],
  });

  const [cleaningTypes, setCleaningTypes] = useState<Option[]>([]);

  //* STATUS ID
  const mapStatusId = (statusString: string): ServiceStatus => {
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
  };

  const statusIdMap: Record<string, string | undefined> = {
    created: "1",
    pending: "2",
    approved: "3",
    rejected: "4",
    completed: "5",
    finished: "6",
  };

  //* FETCH DATA

  const handleGetData = async ({ statusId, page }: { statusId: string, page: number }, isRefreshing: boolean = false) => {
    if (isLoading) return;

    const filter = mapStatusId(statusId);
    setIsRefreshing(isRefreshing);
    setIsLoading(true);

    if (isRefreshing) {
      servicesByStatus[filter].data = [];
      servicesByStatus[filter].meta = { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 };
    }

    if (!servicesByStatus[filter].meta.hasNextPage || page > servicesByStatus[filter].meta.pageCount || page === servicesByStatus[filter].meta.page) {
      setIsLoading(false);
      return;
    }

    switch (user?.roleId) {
      case "1":
        await getAdminServices({ statusId, page });
        break;
      case "2":
        console.log('rol pendiente');
        break;
      case "3":
        await getManagerServices();
        break;
      case "4":
        await getCleanerServices({ statusId, page });
        break;
      case "5":
        console.log('rol pendiente');
        break;
    }

    setIsLoading(false);
    setIsRefreshing(false);
  };

  const getAdminServices = async ({ statusId, page }: { statusId: string, page: number }) => {
    try {
      const { data } = await apiServicesQPS.get<Service>(`/services/by-status/${statusId}?page=${page}`);
      filterServicesByStatus(data);

    } catch (error) {
      console.log('Error en getAdminServices', error);
    }
  };

  const getCleanerServices = async ({ statusId, page }: { statusId: string, page: number }) => {
    try {
      const { data } = await apiServicesQPS.get<Service>(`/services/by-user/${user?.id}/${statusId}?page=${page}`);
      filterServicesByStatus(data);
    } catch (error) {
      console.log('Error en getCleanerServices', error);
    }
  };

  const getManagerServices = async () => {
    const communities = await getCommunitiesByManager();
    try {
      const { data } = await apiServicesQPS.post('/services/by-communities?take=50', { communities });
      filterServicesByStatus(data.data);
    } catch (error) {
      console.log('Error en getManagerServices', error);
    }
  };

  const getCommunitiesByManager = async (): Promise<string[]> => {
    let communities: string[] = [];
    try {
      const { data } = await apiServicesQPS.get<Community[]>(`/communities/by-manager/${user?.id}`);
      data.map((community) => communities.push(community.id));
      return communities;
    } catch (error) {
      console.log('Error en getCommunitiesByManager', error);
      return [];
    }
  };

  const filterServicesByStatus = (data: Service) => {
    for (let i = 0; i < data.data.length; i++) {
      const service = data.data[i];
      const statusKey = mapStatusId(service.statusId);
      if (statusKey) {
        servicesByStatus[statusKey].data.push(service);
        servicesByStatus[statusKey].meta = data.meta;
      }
    }


  };

  //* DATA DROPDOWNS
  const getExtrasList = async () => {
    let data;
    try {
      data = (await apiServicesQPS.get<Extras>('/extras')).data;
      return data
    } catch (error: any) {
      console.log(error);
      /* Sentry.captureMessage(error); */
    }
    return data;
  };

  const getTypesListByCommunity = async (communityId: string) => {
    let data;

    try {
      data = (await apiServicesQPS.get<Type[]>(`/types/by-community/${communityId}`)).data;
      return data
    } catch (error: any) {
      /* Sentry.captureMessage(error); */
    }
    return data;
  };

  const getCommunitiesByManagerList = async () => {
    let data;
    try {
      data = (await apiServicesQPS.get<Community[]>(`/communities/by-manager/${user?.id}`)).data;
      return data
    } catch (error: any) {
      /* Sentry.captureMessage(error); */
      return [];
    }
  };

  const getCommunitiesList = async () => {
    let data;
    try {
      data = (await apiServicesQPS.get<Communities>(`/communities?take=50`)).data;
      return data.data
    } catch (error: any) {
      /* Sentry.captureMessage(error); */
      return [];
    }
  };

  const fetchDataToCreateModal = async () => {
    try {
      let communitiesList;

      if (user?.roleId === "1") {
        communitiesList = await getCommunitiesList();
      } else if (user?.roleId === "3") {
        communitiesList = await getCommunitiesByManagerList();
      } else {
        return;
      }


      const extrasList = await getExtrasList();


      const communityOptions = communitiesList.map((community) => ({
        label: community.communityName,
        value: community.id,
      }));


      const extrasOptions = extrasList?.data?.map((extra) => ({
        label: extra.item,
        value: extra.id,
      })) || [];


      setOptions({
        communities: communityOptions,
        extras: extrasOptions,
      });

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getCleanersList = async (page?: number) => {

    try {
      const { data } = await apiServicesQPS.get<Cleaner>(`/users?take=50`);
      setCleanersList(data.data)
      setFilteredCleanersList(data.data)
    } catch (error: any) {
      console.log(error)
      /* Sentry.captureMessage(error); */
      return [];
    }
  }

  const setTypesOptions = async () => {
    console.log("Current communityId:", communityId); // Depuración
    if (communityId) {
      const typesList = await getTypesListByCommunity(communityId);
      const cleaningTypeOptions = typesList?.map((type) => ({
        label: type.cleaningType,
        value: type.id,
      })) || [];

      console.log("Cleaning type options:", cleaningTypeOptions); // Depuración
      setCleaningTypes(cleaningTypeOptions); // Actualiza el estado independiente
    }
  };


  //*Filter search

  const filterCleaner = (text: string) => {

    setFilterquery(text);

    if (text.trim() !== '') {
      const filteredList = cleanersList.filter((cleaner) =>
        cleaner.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredCleanersList(filteredList);
    } else {
      setFilteredCleanersList(cleanersList);
    }
  };

  //* BOTTOMSHEETS
  const openBottomSheet = (bottomSheetRef: React.RefObject<BottomSheetMethods>, service?: DataService) => {
    if (service) {
      setSelectedService(service);
    }
    bottomSheetRef.current?.expand();
  };

  const handleBottomSheetsActions = async (newStatus: string, bottomSheetRef: React.RefObject<BottomSheetMethods>) => {
    if (!selectedService) {
      return;
    }

    switch (newStatus) {

      case "4":

        if (!comment) {
          Toast.show({
            type: 'error',
            text1: `${t("reject").toUpperCase()}`,
            text2: `${t("confirmOnRejectError")}`
          });
          return;
        }

        break;
      case "5":

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


        break;

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

      let currentStatus = mapStatusId(selectedService.statusId);

      const updatedServices = servicesByStatus[currentStatus].data.filter(
        (service) => service.id !== selectedService.id
      );

      setServicesByStatus((prevState) => ({
        ...prevState,
        [currentStatus]: {
          ...prevState[currentStatus],
          data: updatedServices,
        }
      }));

      setSelectedService(null)

      bottomSheetRef.current?.close();


    } catch (error) {
      console.log(error);
      /* Sentry.captureException(error); */
    }
  };

  const createService = async () => {

    if (!communityId || !typeId || !date || !schedule || !unitySize || !unityNumber) {
      Toast.show({
        type: 'error',
        text1: t('error').toUpperCase(),
        text2: t('fillRequiredFields'),
      });
      return;
    }

    const newServiceData = {
      date: moment(date).format('YYYY-MM-DD'),
      schedule: moment(schedule).format('HH:mm'),
      comment: comment || '',
      unitySize,
      unitNumber: unityNumber,
      communityId,
      typeId,
      statusId: "1",
      userId: selectedCleaner?.id || null,
      extraId: extraId || null,
    };

    try {

      await apiServicesQPS.post('/services', newServiceData);

      setComment('');
      setUnitySize('');
      setUnityNumber('');
      setTypeId('');
      setExtraId('');
      setCommunityId('');
      setDate(new Date());
      setSchedule(new Date());
      setIsDateSelected(false);
      setIsScheduleSelected(false);
      setSelectedCleaner(null);

      // Cerrar el modal
      setIsFullScreenVisible(false);

      handleGetData({ statusId: "1", page: 1 }, true);

    } catch (error) {
      console.error('Error creating service:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: t('service creation failed'),
      });
    }
  };

  const reassignService = async (bottomSheetRef: React.RefObject<BottomSheetMethods>) => {

    if (!selectedService || !selectedCleaner) {
      return;
    }

    const updatedData = {
      date: selectedService.date,
      schedule: selectedService.schedule,
      comment: selectedService.comment,
      userComment: selectedService.userComment,
      unitySize: selectedService.unitySize,
      unitNumber: selectedService.unitNumber,
      communityId: selectedService.communityId,
      typeId: selectedService.typeId,
      statusId: selectedService.statusId,
      userId: selectedCleaner.id,
    };

    await apiServicesQPS.patch(`/services/${selectedService.id}`, updatedData);

    bottomSheetRef.current?.close();
  }

  useEffect(() => {
    if (user.roleId === "1") {
      getCleanersList();
    }

    if (communityId) {
      setTypesOptions();

    }

  }, [servicesByStatus, communityId])


  return {
    user,
    acceptBottomSheet,
    rejectBottomSheet,
    confirmBottomSheet,
    reassignBottomSheet,
    openBottomSheet,
    statusIdMap,
    servicesByStatus,
    handleGetData,
    fetchDataToCreateModal,
    isLoading,
    isRefreshing,
    setSelectedService,
    selectedService,
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
    isDateSelected,
    setIsDateSelected,

    schedule,
    setSchedule,
    isScheduleSelected,
    setIsScheduleSelected,

    options,
    selectedCleaner,
    setSelectedCleaner,

    reassignService,
    cleaningTypes,
    createService,
    isFullScreenVisible,
    setIsFullScreenVisible

  };
};

export default useServicesInformation;
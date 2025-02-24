import { useEffect, useRef, useState } from 'react';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { apiServicesQPS } from '../../../api/services-qps';
import { Community, DataService, Service, ServiceByStatusId, ServiceStatus } from '../../../interfaces/services/services.interface';
import * as secureStore from 'expo-secure-store';
import { UserById } from '../../../interfaces/user/userById';
import { Extras } from '../../../interfaces/services/extras';
import { CleaningTypes, CommunityName } from '../../../interfaces/services/types';
import moment from 'moment';

const useServicesInformation = () => {
  const userString = secureStore.getItem('userData');
  const user: UserById = userString ? JSON.parse(userString) : null;

  const [servicesByStatus, setServicesByStatus] = useState<ServiceByStatusId>({
    created: { data: [], meta: { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 } },
    pending: { data: [], meta: { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 } },
    approved: { data: [], meta: { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 } },
    rejected: { data: [], meta: { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 } },
    completed: { data: [], meta: { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 } },
    finished: { data: [], meta: { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 } },
  });

  const [selectedService, setSelectedService] = useState<DataService | null>(null);

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


  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  //* BOTTOM SHEETS

  const createBottomSheet = useRef<BottomSheetMethods>(null);
  const acceptBottomSheet = useRef<BottomSheetMethods>(null);
  const rejectBottomSheet = useRef<BottomSheetMethods>(null);
  const confirmBottomSheet = useRef<BottomSheetMethods>(null);
  const reassignBottomSheet = useRef<BottomSheetMethods>(null);

  //* OPTIONS

  interface Option {
    label: string;
    value: string;
  }

  const [options, setOptions] = useState<{ communities: Option[], extras: Option[], cleaningTypes: Option[] }>({
    communities: [],
    cleaningTypes: [],
    extras: [],
  });

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
      console.log(data.meta);
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

  const getTypesList = async () => {
    let data;
    try {
      data = (await apiServicesQPS.get<CleaningTypes>('/types')).data;
      return data
    } catch (error: any) {
      /* Sentry.captureMessage(error); */
    }
    return data;
  };

  const getCommunitiesList = async () => {
    let data;
    try {
      data = (await apiServicesQPS.get<Community[]>(`/communities/by-manager/${user?.id}`)).data;
      return data
    } catch (error: any) {
      /* Sentry.captureMessage(error); */
      return [];
    } finally {

    }
  };

  const fetchDataToCreateModal = async () => {
    try {
      const [typesList, communitiesList, extrasList] = await Promise.all([
        getTypesList(),
        getCommunitiesList(),
        getExtrasList()
      ]);

      const cleaningTypeOptions = typesList?.data?.map((type) => ({
        label: type.cleaningType,
        value: type.id,
      })) || [];

      const communityOptions = communitiesList?.map((community) => ({
        label: community.communityName,
        value: community.id,
      })) || [];

      const extrasOptions = extrasList?.data?.map((extra) => ({
        label: extra.item,
        value: extra.id,
      })) || [];

      setOptions({
        communities: communityOptions,
        extras: extrasOptions,
        cleaningTypes: cleaningTypeOptions,
      });

      console.log(communityOptions);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



  //* BOTTOMSHEETS
  const openBottomSheet = (bottomSheetRef: React.RefObject<BottomSheetMethods>, service?: DataService) => {
    if (service) {
      setSelectedService(service);
    }
    bottomSheetRef.current?.expand();
  };

  const handleBottomSheetsActions = async (newStatus: string) => {



  };

  return {
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

    date,
    setDate,
    isDateSelected,
    setIsDateSelected,

    schedule,
    setSchedule,
    isScheduleSelected,
    setIsScheduleSelected,

    options

  };
};

export default useServicesInformation;
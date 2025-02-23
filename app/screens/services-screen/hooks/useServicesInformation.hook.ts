import { useEffect, useRef, useState } from 'react';

import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

import { useAuthStore } from '../../../state';
import { apiServicesQPS } from '../../../api/services-qps';
import { Community, DataService, Service, ServiceByStatusId, ServiceStatus } from '../../../interfaces/services/services.interface';

import * as secureStore from 'expo-secure-store'
import { UserById } from '../../../interfaces/user/userById';


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

  const [selectedService, setSelectedService] = useState<DataService>(); 


  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const createBottomSheet = useRef<BottomSheetMethods>(null);
  const acceptBottomSheet = useRef<BottomSheetMethods>(null);
  const rejectBottomSheet = useRef<BottomSheetMethods>(null);
  const confirmBottomSheet = useRef<BottomSheetMethods>(null);
  const reassignBottomSheet = useRef<BottomSheetMethods>(null);


  //* STATUS ID

  const mapStatusId = (statusString: string): ServiceStatus => {
    const statusNumber = parseInt(statusString);
    const statusMap: { [key: number]: ServiceStatus } = {
      "1": 'created',
      "2": 'pending',
      "3": 'approved',
      "4": 'rejected',
      "5": 'completed',
      "6": 'finished',
    };
    return statusMap[statusNumber] || 'created';
  }

  const statusIdMap: Record<string, string | undefined> = {
    created: "1",
    pending: "2",
    approved: "3",
    rejected: "4",
    completed: "5",
    finished: "6",
  };


  const handleGetData = async({ statusId, page }: { statusId: string, page: number }, isRefreshing: boolean = false) => {


    if (isLoading) {
      return
    }


    const filter = mapStatusId(statusId);

    setIsRefreshing(isRefreshing)
    setIsLoading(true);


    if (isRefreshing) {
      servicesByStatus[filter].data = []
      servicesByStatus[filter].meta = { hasNextPage: true, hasPreviousPage: false, page: 0, pageCount: 1, take: 10, totalCount: 0 }
    }

    if (
      !servicesByStatus[filter].meta.hasNextPage ||
      page > servicesByStatus[filter].meta.pageCount ||
      page === servicesByStatus[filter].meta.page
    ) {
      setIsLoading(false);
      return;
    }

    switch (user?.roleId) {
      case "1":
        await getAdminServices({ statusId, page })
        break
      case "2":
        console.log('rol pendiente')
        break
      case "3":
        await getManagerServices()
        break
      case "4":
        await  getCleanerServices({ statusId, page })
        break
      case "5":
        console.log('rol pendiente')
        break
    }

    setIsLoading(false);
    setIsRefreshing(false);

  }

  const getAdminServices = async ({ statusId, page }: { statusId: string, page: number }) => {
    try {
      const { data } = await apiServicesQPS.get<Service>(`/services/by-status/${statusId}?page=${page}`);
      filterServicesByStatus(data)
      console.log(data.meta)
    } catch (error) {
      console.log('Error en getAdminServices', error)
    }
  }

  const getCleanerServices = async ({ statusId, page }: { statusId: string, page: number }) => {
    try {
      const { data } = await apiServicesQPS.get<Service>(`/services/by-user/${user?.id}/${statusId}?page=${page}`);
      filterServicesByStatus(data)
    } catch (error) {
      console.log('Error en getCleanerServices', error)
    }
  }

  //Services by communities
  const getManagerServices = async () => {

    const communities = await getCommunitiesByManager();

    try {
      const { data } = await apiServicesQPS.post('/services/by-communities?take=50', {communities});
      filterServicesByStatus(data.data)
    } catch (error) {
      console.log('Error en getManagerServices', error)
    }
  }

  const getCommunitiesByManager = async (): Promise<string[]> => {

    let communities: string[] = [];

    try {
      const { data } = await apiServicesQPS.get<Community[]>(`/communities/by-manager/${user?.id}`);
      data.map((community) => communities.push(community.id))
      return communities
    } catch (error) {
      console.log('Error en getCommunitiesByManager', error)
      return []
    }
  }

  const filterServicesByStatus = (data: Service) => {
    for (let i = 0; i < data.data.length; i++) {
      const service = data.data[i];

      const statusKey = mapStatusId(service.statusId);

      if (statusKey) {
        servicesByStatus[statusKey].data.push(service);
        servicesByStatus[statusKey].meta = data.meta
      }
    }
  };

  //* BOTTOMSHEETS
  const openBottomSheet = (bottomSheetRef: React.RefObject<BottomSheetMethods>) => {
    bottomSheetRef.current?.expand();
    console.log(selectedService?.id)
  };

  const handleBottomSheetsActions = async (newStatus: string) => {

    console.log(selectedService?.id)

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

    isLoading,
    isRefreshing,

    setSelectedService,
    selectedService,
    
    handleBottomSheetsActions

  };

};

export default useServicesInformation;
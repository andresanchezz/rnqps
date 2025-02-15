import * as SecureStorage from 'expo-secure-store';
import * as Sentry from "@sentry/react-native";
import { useEffect, useRef, useState } from 'react';
import { Service, Services } from '../../../interfaces/services/services.interface';
import { apiServicesQPS } from '../../../api/services-qps';
import moment from 'moment';
import { CommunitiesByManager } from '../../../interfaces/services/communities';
import { Extras } from '../../../interfaces/services/extras';
import { CleaningTypes } from '../../../interfaces/services/types';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';
import { UserById } from '../../../interfaces/user/userById';

interface Option {
    label: string;
    value: string;
}

const STATUS = {
    CREATED: '1',
    PENDING: '2',
    APPROVED: '3',
    REJECTED: '4',
    COMPLETED: '5',
    FINISHED: '6',
};

interface ServicesByStatus {
    all: Services;
    created: Service[];
    pending: Service[];
    approved: Service[];
    rejected: Service[];
    completed: Service[];
    finished: Service[];
}

const useServicesInformation = () => {

    const userString = SecureStore.getItem('userData');
    const user = userString ? JSON.parse(userString) : null;

    const [servicesByStatus, setServicesByStatus] = useState<ServicesByStatus>({
        all: { data: [], meta: { hasNextPage: false, page: 0, take: 0, totalCount: 0, pageCount: 0, hasPreviousPage: false } },
        created: [],
        pending: [],
        approved: [],
        rejected: [],
        completed: [],
        finished: [],
    });


    const [isFetchingCommunities, setIsFetchingCommunities] = useState<boolean>(false);
    const [communitiesError, setCommunitiesError] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const [options, setOptions] = useState<{ communities: Option[], extras: Option[], cleaningTypes: Option[] }>({
        communities: [],
        cleaningTypes: [],
        extras: []
    });

    const createBottomSheet = useRef<any>(null);
    const acceptBottomSheet = useRef<any>(null);
    const denyBottomSheet = useRef<any>(null);
    const confirmBottomSheet = useRef<any>(null);


    const fetchServices = async (page: number, isRefreshing: boolean = false) => {
        if (isLoading) return; 
        setIsLoading(true);

        try {
            const { path } = pathByRole();
            let data: Services;

            if (user?.roleId === "4") {
                data = (await apiServicesQPS.post(`${path}/${user.id}?page=${page}`)).data;
            } else if (user?.roleId === "3") {
                const communitiesResponse = await apiServicesQPS.get<CommunitiesByManager[]>(`/communities/by-manager/${user.id}`);
                const communities = communitiesResponse.data;

                const communityIds = communities.map((community) => community.id);

                if (communityIds.length > 0) {
                    const requestBody = {
                        communities: communityIds,
                    };
                    data = (await apiServicesQPS.post(path, requestBody)).data;
                } else {
                    data = { data: [], meta: { hasNextPage: false, page: 0, take: 0, totalCount: 0, pageCount: 0, hasPreviousPage: false } };
                }
            } else {
                data = (await apiServicesQPS.get(`${path}?page=${page}`)).data;
            }

            const classifiedServices: Record<"created" | "pending" | "approved" | "rejected" | "completed" | "finished",
                Service[]> = {
                created: [],
                pending: [],
                approved: [],
                rejected: [],
                completed: [],
                finished: [],
            };

            data.data.forEach((service) => {
                switch (service.statusId) {
                    case STATUS.CREATED:
                        classifiedServices.created.push(service);
                        break;
                    case STATUS.PENDING:
                        classifiedServices.pending.push(service);
                        break;
                    case STATUS.APPROVED:
                        classifiedServices.approved.push(service);
                        break;
                    case STATUS.REJECTED:
                        classifiedServices.rejected.push(service);
                        break;
                    case STATUS.COMPLETED:
                        classifiedServices.completed.push(service);
                        break;
                    case STATUS.FINISHED:
                        classifiedServices.finished.push(service);
                        break;
                    default:
                        break;
                }
            });

            if (isRefreshing) {
                setServicesByStatus({
                    all: data,
                    ...classifiedServices,
                });
            } else {
                setServicesByStatus((prevServices) => ({
                    all: {
                        ...data,
                        data: [...(prevServices.all.data || []), ...data.data],
                    },
                    created: [...prevServices.created, ...classifiedServices.created],
                    pending: [...prevServices.pending, ...classifiedServices.pending],
                    approved: [...prevServices.approved, ...classifiedServices.approved],
                    rejected: [...prevServices.rejected, ...classifiedServices.rejected],
                    completed: [...prevServices.completed, ...classifiedServices.completed],
                    finished: [...prevServices.finished, ...classifiedServices.finished],
                }));
            }

            setHasMore(data.meta.hasNextPage);
        } catch (error: any) {
            console.error("Error fetching services:", error);
            Sentry.captureMessage(error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const refreshServices = async () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        setCurrentPage(1);
        await fetchServices(1, true);
    };

    const loadMoreServices = async () => {
        if (!isLoading && hasMore) {
            setCurrentPage((prevPage) => prevPage + 1);
            await fetchServices(currentPage + 1);
        }
    };

    const pathByRole = (): { path: string, method: string } => {
        switch (user!.roleId) {
            case "1":
                return {
                    path: `/services`,
                    method: 'GET'
                };
            case "3":
                return {
                    path: `/services/by-communities`,
                    method: 'POST'
                };
            case "4":
                return {
                    path: `/services/by-cleaner`,
                    method: 'POST'
                };
            default:
                return {
                    path: `/services`,
                    method: 'GET'
                };
        }
    };


    const openCreateServicesSheet = () => {
        createBottomSheet.current?.expand();
    };

    const openAcceptSheet = () => {
        acceptBottomSheet.current?.expand();
    };

    const openDenySheet = () => {
        denyBottomSheet.current?.expand();
    };

    const openConfirmSheet = () => {
        confirmBottomSheet.current?.expand();
    };

    const handleUserSelectedAction = async (newStatus: string) => {
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
                    text1: 'Error en la fecha',
                    text2: 'No puedes aceptar antes de la fecha de realización'
                });
                return;
            }
        }

        if (newStatus === "4" && !comment) {
            Toast.show({
                type: 'error',
                text1: 'Error en el comentario',
                text2: 'No puedes rechazar sin un motivo'
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

            updateServiceStatusLocally(selectedService.id, newStatus);

            acceptBottomSheet.current?.close();
            denyBottomSheet.current?.close();
            confirmBottomSheet.current?.close();
        } catch (error) {
            console.log(error);
            Sentry.captureException(error);
        }
    };

    const updateServiceStatusLocally = (serviceId: string, newStatus: string) => {
        setServicesByStatus((prev) => {
            const updatedServices = { ...prev };

            const findAndRemoveService = (statusKey: keyof ServicesByStatus) => {
               
                const servicesArray = updatedServices[statusKey] as Service[];
                const index = servicesArray.findIndex((s) => s.id === serviceId);
                if (index !== -1) {
                    const [service] = servicesArray.splice(index, 1);
                    return service;
                }
                return null;
            };
            const service =
                findAndRemoveService("created") ||
                findAndRemoveService("pending") ||
                findAndRemoveService("approved") ||
                findAndRemoveService("rejected") ||
                findAndRemoveService("completed") ||
                findAndRemoveService("finished");

            if (service) {
                service.statusId = newStatus;
                switch (newStatus) {
                    case STATUS.CREATED:
                        updatedServices.created.push(service);
                        break;
                    case STATUS.PENDING:
                        updatedServices.pending.push(service);
                        break;
                    case STATUS.APPROVED:
                        updatedServices.approved.push(service);
                        break;
                    case STATUS.REJECTED:
                        updatedServices.rejected.push(service);
                        break;
                    case STATUS.COMPLETED:
                        updatedServices.completed.push(service);
                        break;
                    case STATUS.FINISHED:
                        updatedServices.finished.push(service);
                        break;
                    default:
                        break;
                }
            }

            return updatedServices;
        });
    };

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
            const { data } = await apiServicesQPS.post('/services', newService);
            console.log(data);
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

    const getCommunitiesList = async (): Promise<CommunitiesByManager[]> => {
        if (isFetchingCommunities || communitiesError) return []; // Evitar llamadas repetidas
        setIsFetchingCommunities(true); // Marcar como en proceso
        setCommunitiesError(false); // Resetear el estado de error

        try {
            const response = await apiServicesQPS.get<CommunitiesByManager[]>(`/communities/by-manager/${user?.id}`);

            // Verificar si la respuesta es un error 404
            if (response.status === 404) {
                console.warn("No se encontraron comunidades para el manager:", user?.id);
                return []; // Retornar un array vacío si no hay comunidades
            }

            // Verificar si la respuesta tiene datos
            if (response.data && Array.isArray(response.data)) {
                return response.data; // Retornar los datos si todo está bien
            } else {
                console.warn("La respuesta no contiene un array de comunidades:", response.data);
                return []; // Retornar un array vacío si no hay datos válidos
            }
        } catch (error: any) {
            // Capturar el error en Sentry y loguearlo en la consola
            Sentry.captureMessage(error);
            console.error("Error fetching communities:", error);

            // Marcar que hubo un error
            setCommunitiesError(true);

            // Retornar un array vacío en caso de error
            return [];
        } finally {
            setIsFetchingCommunities(false); // Marcar como finalizado
        }
    };

    const fetchDataToCreateModal = async () => {
        const typesList = await getTypesList();
        const communitiesList = await getCommunitiesList();
        const extrasList = await getExtrasList();

        const cleaningTypeOptions: Option[] = typesList!.data.map((type) => ({
            label: type.cleaningType,
            value: type.id,
        }));

        const communityOptions: Option[] = communitiesList.length > 0
            ? communitiesList.map((community) => ({
                label: community.communityName,
                value: community.id,
            }))
            : [{ label: "No related communities", value: "" }];

        const extrasOptions: Option[] = extrasList!.data.map((extra) => ({
            label: extra.item,
            value: extra.id,
        }));

        setOptions({ communities: communityOptions, extras: extrasOptions, cleaningTypes: cleaningTypeOptions });
    };

    useEffect(() => {
        fetchServices(1);
        if (user?.roleId !== "4") {
            fetchDataToCreateModal();
        } 
    },[]);

    return {
        services: servicesByStatus.all,
        servicesByStatus,
        user,
        createNewService,
        schedule,
        setSchedule,
        isScheduleSelected,
        setisScheduleSelected,
        date,
        setDate,
        isDateSelected,
        setIsDateSelected,
        comment,
        unitySize,
        unityNumber,
        communityId,
        typeId,
        extraId,
        options,
        setComment,
        setUnitySize,
        setUnityNumber,
        setCommunityId,
        setTypeId,
        setExtraId,
        setSelectedService,
        createBottomSheet,
        denyBottomSheet,
        acceptBottomSheet,
        confirmBottomSheet,
        openAcceptSheet,
        openConfirmSheet,
        openDenySheet,
        handleUserSelectedAction,
        openCreateServicesSheet,
        isLoading,
        isRefreshing,
        hasMore,
        refreshServices,
        loadMoreServices,
        
    };
};

export default useServicesInformation;
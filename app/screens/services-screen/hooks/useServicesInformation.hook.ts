import * as SecureStorage from 'expo-secure-store';
import * as Sentry from "@sentry/react-native";
import { useEffect, useRef, useState } from 'react';
import { Service, Services } from '../../../interfaces/services/services.interface';
import { apiServicesQPS } from '../../../api/services-qps';
import { useAuthStore } from '../../../state';
import moment from 'moment';
import { CommunitiesByManager } from '../../../interfaces/services/communities';
import { Extras } from '../../../interfaces/services/extras';
import { CleaningTypes } from '../../../interfaces/services/types';

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
    const { user } = useAuthStore();

    const [servicesByStatus, setServicesByStatus] = useState<ServicesByStatus>({
        all: { data: [], meta: { hasNextPage: false, page: 0, take: 0, totalCount: 0, pageCount: 0, hasPreviousPage: false } },
        created: [],
        pending: [],
        approved: [],
        rejected: [],
        completed: [],
        finished: [],
    });

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
        SecureStorage.deleteItemAsync('userToken');
        if (isLoading) return;
        setIsLoading(true);

        try {
            const { path, method } = pathByRole();
            let data: Services;

            if (method === 'GET') {
                data = (await apiServicesQPS.get(`${path}?page=${page}`)).data;
            } else {
                data = (await apiServicesQPS.post(`${path}?page=${page}`)).data;
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
            Sentry.captureMessage(error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
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
                    path: '/services/by-communities',
                    method: 'POST'
                };
            case "4":
                return {
                    path: `/services/by-cleaner/${user?.id}`,
                    method: 'POST'
                };
            default:
                return {
                    path: `/services`,
                    method: 'GET'
                };
        }
    };

    const refreshServices = async () => {
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

    const handleUserSelectedAction = async (selectedStatus: string) => {
        if (!selectedService) {
            return;
        }

        if (selectedStatus === "5") {
            const now = moment();
            const selectedDateTime = moment(selectedService.date).set({
                hour: moment(selectedService.schedule).hour(),
                minute: moment(selectedService.schedule).minute(),
            });

            if (now.isBefore(selectedDateTime)) {
                return;
            }
        }

        if (selectedStatus === "4" && !comment) {
            return;
        }

        const updatedData = {
            date: selectedService.date,
            schedule: selectedService.schedule,
            comment: selectedService.comment,
            userComment: selectedStatus === "4" ? comment : selectedService.userComment,
            unitySize: selectedService.unitySize,
            unitNumber: selectedService.unitNumber,
            communityId: selectedService.communityId,
            typeId: selectedService.typeId,
            statusId: selectedStatus,
            userId: selectedService.userId,
        };

        try {
            await apiServicesQPS.patch(`/services/${selectedService.id}`, updatedData);
            acceptBottomSheet.current?.close();
            denyBottomSheet.current?.close();
        } catch (error) {
            Sentry.captureException(error);
        }
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

    const getCommunitiesList = async () => {
        let data;
        try {
            data = (await apiServicesQPS.get<CommunitiesByManager[]>(`/communities/by-manager/2`)).data;
        } catch (error: any) {
            console.log(error);
            Sentry.captureMessage(error);
        }
        return data;
    };

    const fetchDataToCreateModal = async () => {
        const typesList = await getTypesList();
        const communitiesList = await getCommunitiesList();
        const extrasList = await getExtrasList();

        const cleaningTypeOptions: Option[] = typesList!.data.map((type) => ({
            label: type.cleaningType,
            value: type.id,
        }));

        const communityOptions: Option[] = communitiesList!.map((community) => ({
            label: community.communityName,
            value: community.id,
        }));

        const extrasOptions: Option[] = extrasList!.data.map((extra) => ({
            label: extra.item,
            value: extra.id,
        }));

        setOptions({ communities: communityOptions, extras: extrasOptions, cleaningTypes: cleaningTypeOptions });
    };

    useEffect(() => {
        fetchServices(1);
        fetchDataToCreateModal();
    }, [currentPage]);

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
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

const useServicesInformation = () => {

    const { user } = useAuthStore();

    const [services, setServices] = useState<Services>();
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

    const [options, setOptions] = useState<{ communities: Option[], extras: Option[], cleaningTypes: Option[] }>({
        communities: [],
        cleaningTypes: [],
        extras: []
    });

    const createBottomSheet = useRef<any>(null);
    const acceptBottomSheet = useRef<any>(null);
    const denyBottomSheet = useRef<any>(null);
    const confirmBottomSheet = useRef<any>(null);

    const authStore = useAuthStore();

    const fetchServices = async () => {
        SecureStorage.deleteItemAsync('userToken')

        let data: Services;
        const { path, method } = pathByRole();

        try {

            if (path === '/services/by-communities') {
                data = (await apiServicesQPS.post(`${path}`)).data;
            } else {
                if (method === 'GET') {
                    data = (await apiServicesQPS.get(`${path}`)).data;

                } else {
                    data = (await apiServicesQPS.post(`${path}`)).data;
                }
            }

            setServices(data);
        } catch (error) {
            console.log('Error en la petición', error);
        }finally{
            console.log('PATH', path);
        }


    };

    const pathByRole = (): { path: string, method: string } => {

        switch (user!.roleId) {
            case "1":
                return {
                    path: `/services?page=${currentPage}`,
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
                    path: `/services?page=${currentPage}`,
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

        await apiServicesQPS.post('/services', newService);
        createBottomSheet.current?.close();
    };

    const getExtrasList = async () => {
        const { data } = await apiServicesQPS.get<Extras>('/extras');
        return data;
    };

    const getTypesList = async () => {
        const { data } = await apiServicesQPS.get<CleaningTypes>('/types');
        return data;
    };

    const getCommunitiesList = async () => {
        const userId = await SecureStorage.getItemAsync('userId');
        const { data } = await apiServicesQPS.get<CommunitiesByManager[]>(`/communities/by-manager/${userId}`);
        return data;
    };

    const fetchDataToCreateModal = async () => {
        /* const typesList = await getTypesList();
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

        setOptions({ communities: communityOptions, extras: extrasOptions, cleaningTypes: cleaningTypeOptions }); */
    };

    useEffect(() => {
        fetchServices();

    }, []);

    return {
        services,
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
        openCreateServicesSheet
    };
};

export default useServicesInformation;
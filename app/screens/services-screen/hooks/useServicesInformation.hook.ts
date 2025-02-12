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
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
    const [schedule, setSchedule] = useState(moment().format('hh:mm'));

    const [unitSize, setUnitSize] = useState<string>();
    const [unitNumber, setUnitNumber] = useState<string>();
    const [comment, setComment] = useState<string>();

    const [communityId, setCommunityId] = useState<string>();

    const [typeId, setTypeId] = useState<string>();

    const [extraId, setExtraId] = useState<string>();

    const [ selectedService, setSelectedService] = useState<Service>();

    const [options, setOptions] = useState<{ communities: Option[], extras: Option[], cleaningTypes: Option[] }>({
        communities: [],
        cleaningTypes: [],
        extras: []
    })

    const createBottomSheet = useRef<any>(null);
    const acceptBottomSheet = useRef<any>(null);
    const denyBottomSheet = useRef<any>(null);

    const fetchServices = async () => {
        let data: Services;
        try {
            const userId = SecureStorage.getItem("userId");
            const { path, method } = pathByRole("4");

            if (method === "GET") {
                const response = await apiServicesQPS.get<Services>(`${path}/${userId}?page=${currentPage}`);
                data = response.data;
            } else {
                const response = await apiServicesQPS.post<Services>(`${path}/${userId}?page=${currentPage}`);
                data = response.data;
            }

            setServices(data);

        } catch (error: any) {
            console.log(error);
            Sentry.captureMessage(error);
        } finally {
            setIsLoading(false);
        }
    };

    const openAcceptSheet = () => {
        acceptBottomSheet.current?.expand();
    };

    const openDenySheet = () => {
        denyBottomSheet.current?.expand();
    };

    const openConfirmSheet = () => {

    }

    const handleUserSelectedAction = async(selectedStatus: string) =>{
        
        console.log(selectedStatus, comment);

        if(!selectedService){
            return
        }
        
        if(selectedStatus == "4" && !comment){
            return
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

        const resp = await apiServicesQPS.patch(`/services/${selectedService.id}`, updatedData);

        acceptBottomSheet.current?.close();
        denyBottomSheet.current?.close();
 

    }

    const pathByRole = (role: string): { path: string, method: string } => {
        switch (role) {
            case "4":
                return {
                    path: '/services/by-cleaner',
                    method: 'POST'
                };
            case "3":
                return {
                    path: '/services/by-communities',
                    method: 'POST'
                };
            default:
                return {
                    path: '/services',
                    method: 'GET'
                };
        }
    };

    const addNewService = async () => {
        const newService = {
            unitySize: unitSize,
            date,
            schedule,
            unitNumber,
            typeId,
            extraId,
            comment,
            communityId,
            statusId: '1'
        };

        await apiServicesQPS.post('/services', newService);
    };

    const getExtrasList = async () => {
        const { data } = await apiServicesQPS.get<Extras>('/extras');
        return data
    };

    const getTypesList = async () => {
        const { data } = await apiServicesQPS.get<CleaningTypes>('/types');
        return data
    };

    const getCommunitiesList = async () => {
        const userId = await SecureStorage.getItemAsync('userId');
        const { data } = await apiServicesQPS.get<CommunitiesByManager[]>(`/communities/by-manager/${userId}`);
        return data;
    };

    const fetchDataToCreateModal = async () => {
        const typesList = await getTypesList();
        const communitiesList = await getCommunitiesList();
        const extrasList = await getExtrasList()

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

        setOptions({ communities: communityOptions, extras: extrasOptions, cleaningTypes: cleaningTypeOptions })
    };


    useEffect(() => {
        fetchServices();
        fetchDataToCreateModal();
        console.log(user);
    }, []);

    return {
        isLoading,
        services,
        user,
        addNewService,
        schedule,
        setSchedule,
        comment,
        unitSize,
        unitNumber,
        communityId,
        typeId,
        extraId,
        options,
        setComment,
        setUnitSize,
        setUnitNumber,
        setCommunityId,
        setTypeId,
        setExtraId,
        setDate,
        setSelectedService,
        createBottomSheet,
        denyBottomSheet,
        acceptBottomSheet,
        openAcceptSheet,
        openConfirmSheet,
        openDenySheet,
        handleUserSelectedAction
    };
};

export default useServicesInformation;
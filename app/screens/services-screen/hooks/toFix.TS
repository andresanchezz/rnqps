/* const createNewService = async () => {
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
}; */

/* const getExtrasList = async () => {
    let data;
    try {
        data = (await apiServicesQPS.get<Extras>('/extras')).data;
    } catch (error: any) {
        console.log(error);
        Sentry.captureMessage(error);
    }
    return data;
}; */

/* const getTypesList = async () => {
    let data;
    try {
        data = (await apiServicesQPS.get<CleaningTypes>('/types')).data;
    } catch (error: any) {
        Sentry.captureMessage(error);
    }
    return data;
}; */

/* const getCommunitiesList = async (): Promise<CommunitiesByManager[]> => {
    if (isFetchingCommunities || communitiesError) return [];
    setIsFetchingCommunities(true);
    setCommunitiesError(false);

    try {
        const response = await apiServicesQPS.get<CommunitiesByManager[]>(`/communities/by-manager/${user?.id}`);


        if (response.status === 404) {
            console.warn("No se encontraron comunidades para el manager:", user?.id);
            return [];
        }


        if (response.data && Array.isArray(response.data)) {
            return response.data;
        } else {
            console.warn("La respuesta no contiene un array de comunidades:", response.data);
            return [];
        }
    } catch (error: any) {

        Sentry.captureMessage(error);
        console.error("Error fetching communities:", error);

        setCommunitiesError(true);


        return [];
    } finally {
        setIsFetchingCommunities(false);
    }
}; */

/* const fetchDataToCreateModal = async () => {
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
}; */

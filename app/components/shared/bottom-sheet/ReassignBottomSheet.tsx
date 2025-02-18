import React, { useRef, useState } from 'react';
import MyCustomBottomSheet from './MyCustomBottomSheet';
import { Text, Button } from 'react-native-paper';
import { View } from 'react-native';
import useServicesInformation from '../../../screens/services-screen/hooks/useServicesInformation.hook';

export const ReassignBottomSheet = () => {

    const {reassignBottomSheet} = useServicesInformation()

    return (

        <MyCustomBottomSheet ref={reassignBottomSheet}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Contenido del BottomSheet</Text>
            </View>
        </MyCustomBottomSheet>

    );
};

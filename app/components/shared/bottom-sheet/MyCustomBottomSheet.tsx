import React, { ReactNode, useCallback, useRef, forwardRef } from 'react';
import CustomBottomSheet, {
    BottomSheetView,
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { StyleSheet, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';

import { colors } from '../../../../styles/colors';

interface BottomSheetProps {
    children: ReactNode;
    snapPoints?: string[]
}

const MyCustomBottomSheet = forwardRef<CustomBottomSheet, BottomSheetProps>(
    ({ children, snapPoints = ['50%', '75%'] }, ref,) => {

        const handleSheetChanges = useCallback((index: number) => {

        }, []);


        const renderBackdrop = useCallback(
            (props: BottomSheetBackdropProps) => (
                <BottomSheetBackdrop
                    {...props}
                    disappearsOnIndex={-1}
                    appearsOnIndex={1}
                />
            ),
            []
        );

        return (
            <CustomBottomSheet enableContentPanningGesture={false}

                ref={ref}
                index={-1}

                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                backdropComponent={renderBackdrop}
            >
                <PaperProvider>
                    <BottomSheetView style={styles.bottomSheetContent}>
                        <View style={{flex:1}}>
                        {children}
                        </View>
                    </BottomSheetView>
                </PaperProvider>
            </CustomBottomSheet>
        );
    }
);

export default MyCustomBottomSheet;

const styles = StyleSheet.create({
    bottomSheetContent: {
        flex: 1,
        backgroundColor: colors.light,
        padding: 20
    },
    bottomSheetTitle: {

        textAlign: 'center',
    },
});
import React, { ReactNode, useCallback, useRef, forwardRef } from 'react';
import CustomBottomSheet, {
    BottomSheetView,
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { typography } from '../../../../styles/typography';
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
                        {children}
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
        ...typography.headingMedium.bold,
        textAlign: 'center',
    },
});
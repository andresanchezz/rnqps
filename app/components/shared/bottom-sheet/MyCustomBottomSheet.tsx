import React, { ReactNode, useCallback, useRef, forwardRef } from 'react';
import CustomBottomSheet, {
    BottomSheetView,
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { PaperProvider } from 'react-native-paper';

interface BottomSheetProps {
    children: ReactNode;
    snapPoints?: string[];
    onCloseSheet?: () => void;
}

const MyCustomBottomSheet = forwardRef<CustomBottomSheet, BottomSheetProps>(
    ({ children, snapPoints = ['50%', '75%'], onCloseSheet }, ref) => {

        const handleSheetChanges = useCallback((index: number) => {
            if (index === -1) {
                Keyboard.dismiss();
                if (onCloseSheet) {
                    onCloseSheet();
                }
            }
        }, [onCloseSheet]);

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
            <CustomBottomSheet

                ref={ref}
                index={-1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                backdropComponent={renderBackdrop}
                enableContentPanningGesture={false}
                enablePanDownToClose={true}
                keyboardBehavior='interactive'
            >
                <PaperProvider>
                    <BottomSheetView style={styles.bottomSheetContent}>
                        <KeyboardAvoidingView style={{flex: 1}}>
                            {children}
                        </KeyboardAvoidingView>
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
        padding: 20,
    },
    bottomSheetTitle: {
        textAlign: 'center',
    },
});
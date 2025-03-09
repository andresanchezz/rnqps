import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { IconButton, Portal } from 'react-native-paper';

export const FullScreenModal = ({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const hideModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  if (!visible) return null;

  return (
    <Portal>
      <Animated.View
        style={[
          styles.modalContainer,
          { opacity: fadeAnim },
        ]}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <IconButton
              icon="close"
              onPress={hideModal}
              style={styles.closeButton}
            />
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Animated.View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'white',
  },
  header: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1, 
    paddingHorizontal: 20,
    paddingBottom: 100, 
  },
  closeButton: {

  },
});
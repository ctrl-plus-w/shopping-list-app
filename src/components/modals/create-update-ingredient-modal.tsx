import { ForwardedRef, forwardRef, ReactNode, useCallback, useMemo } from 'react';

import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CreateUpdateIngredientForm from '@/module/create-update-ingredient-form';

import ModalBackdrop from '@/element/modal-backdrop';

interface IProps {
  children?: ReactNode;
}

const CreateUpdateIngredientModal = (
  { children }: IProps,
  createUpdateBottomSheetModalRef: ForwardedRef<BottomSheetModal>,
) => {
  const snapPoints = useMemo(() => ['90%', '90%'], []);

  const closeModal = useCallback(() => {
    if (createUpdateBottomSheetModalRef && 'current' in createUpdateBottomSheetModalRef)
      createUpdateBottomSheetModalRef?.current?.close();
  }, []);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          {children}

          <BottomSheetModal
            backdropComponent={ModalBackdrop}
            ref={createUpdateBottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
          >
            <BottomSheetView style={styles.contentContainer}>
              <CreateUpdateIngredientForm callback={closeModal} />
            </BottomSheetView>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default forwardRef<BottomSheetModal, IProps>(CreateUpdateIngredientModal);

const styles = StyleSheet.create({
  safeArea: {
    margin: 32,
    display: 'flex',
    flexDirection: 'row',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 8,
  },
});

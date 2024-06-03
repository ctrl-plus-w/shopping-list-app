import { ForwardedRef, forwardRef, ReactNode, useCallback, useMemo } from 'react';

import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CreateUpdateIngredientForm from '@/module/create-update-ingredient-form';

import ModalBackdrop from '@/element/modal-backdrop';

import { useCart } from '@/context/cart-context';

import { TCartIngredient } from '@/type/database';

interface IProps {
  ingredient?: TCartIngredient;
  children?: ReactNode;
}

const CreateUpdateIngredientModal = (
  { ingredient, children }: IProps,
  createUpdateBottomSheetModalRef: ForwardedRef<BottomSheetModal>,
) => {
  const { refreshCart } = useCart();
  const snapPoints = useMemo(() => ['90%', '90%'], []);

  const closeModal = useCallback(() => {
    if (createUpdateBottomSheetModalRef && 'current' in createUpdateBottomSheetModalRef)
      createUpdateBottomSheetModalRef?.current?.close();
  }, []);

  const afterCreateUpdateIngredient = () => {
    refreshCart().then();
    closeModal();
  };

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          {children}

          <BottomSheetModal
            backdropComponent={ModalBackdrop}
            ref={createUpdateBottomSheetModalRef}
            snapPoints={snapPoints}
            index={1}
          >
            <BottomSheetView style={styles.contentContainer}>
              <CreateUpdateIngredientForm ingredient={ingredient} callback={afterCreateUpdateIngredient} />
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

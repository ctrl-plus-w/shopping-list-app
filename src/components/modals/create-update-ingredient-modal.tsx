import { ForwardedRef, forwardRef, ReactNode, useCallback, useMemo } from 'react';

import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CreateUpdateIngredientForm from '@/module/create-update-ingredient-form';

import ModalBackdrop from '@/element/modal-backdrop';

import { useCart } from '@/context/cart-context';

import { CreateIngredientHandler, UpdateIngredientHandler } from '@/util/ingredients';

import { TCartIngredient, TRecipeIngredient } from '@/type/database';

interface IProps {
  children?: ReactNode;

  ingredient?: TCartIngredient | TRecipeIngredient;
  createHandler: CreateIngredientHandler;
  updateHandler: UpdateIngredientHandler;
}

const CreateUpdateIngredientModal = (
  { ingredient, children, createHandler, updateHandler }: IProps,
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
              <CreateUpdateIngredientForm
                {...{ ingredient, createHandler, updateHandler }}
                callback={afterCreateUpdateIngredient}
              />
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

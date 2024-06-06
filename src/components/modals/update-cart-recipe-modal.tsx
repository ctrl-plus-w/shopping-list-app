import { ForwardedRef, forwardRef, ReactNode, useCallback, useMemo } from 'react';

import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import UpdateCartRecipeForm from '@/module/update-cart-recipe-form';

import ModalBackdrop from '@/element/modal-backdrop';

import { useCart } from '@/context/cart-context';

import { UpdateRecipeHandler } from '@/util/recipes';

import { TCartRecipe } from '@/type/database';

interface IProps {
  children?: ReactNode;
  callback?: ((ingredient: TCartRecipe) => void) | ((ingredient: TCartRecipe) => Promise<void>);

  recipe?: TCartRecipe;
  updateHandler: UpdateRecipeHandler<TCartRecipe>;
}

const UpdateCartRecipeModal = (
  { recipe, children, updateHandler, callback }: IProps,
  createUpdateBottomSheetModalRef: ForwardedRef<BottomSheetModal>,
) => {
  const { refreshCart } = useCart();
  const snapPoints = useMemo(() => ['90%', '90%'], []);

  const closeModal = useCallback(() => {
    if (createUpdateBottomSheetModalRef && 'current' in createUpdateBottomSheetModalRef)
      createUpdateBottomSheetModalRef?.current?.close();
  }, []);

  const afterCreateUpdateRecipe = (recipe: TCartRecipe) => {
    refreshCart().then();
    closeModal();

    callback && callback(recipe);
  };

  return recipe ? (
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
              <UpdateCartRecipeForm {...{ recipe, updateHandler }} callback={afterCreateUpdateRecipe} />
            </BottomSheetView>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  ) : (
    children
  );
};

export default forwardRef(UpdateCartRecipeModal);

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

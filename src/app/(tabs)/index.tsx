import { useRef, useState } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Text } from '@rneui/themed';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

import CreateUpdateIngredientModal from '@/modal/create-update-ingredient-modal';

import IngredientsList from '@/module/ingredients-list';

import { useCart } from '@/context/cart-context';

import { createCartIngredient, updateCartIngredient } from '@/util/ingredients';

import { TCartIngredient } from '@/type/database';

const HomeScreen = () => {
  const { ingredients } = useCart();

  const [updatingIngredient, setUpdatingIngredient] = useState<TCartIngredient | undefined>(undefined);

  const createUpdateBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const openUpdateIngredientModal = (ingredient: TCartIngredient) => () => {
    setUpdatingIngredient(ingredient);
    createUpdateBottomSheetModalRef.current?.present();
  };

  return (
    <CreateUpdateIngredientModal
      ingredient={updatingIngredient}
      createHandler={createCartIngredient}
      updateHandler={updateCartIngredient}
      ref={createUpdateBottomSheetModalRef}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text h2>Ingrédients</Text>

          <TouchableOpacity onPress={() => createUpdateBottomSheetModalRef?.current?.present()}>
            <Ionicons name="add" size={32} />
          </TouchableOpacity>
        </View>

        <IngredientsList ingredients={ingredients} onPress={openUpdateIngredientModal} />
      </SafeAreaView>
    </CreateUpdateIngredientModal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    margin: 32,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 8,
  },
});

export default HomeScreen;
